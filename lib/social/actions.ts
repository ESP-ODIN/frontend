"use server"

import { cookies } from "next/headers"

import {
  createPost,
  deletePost,
  getPostLikes,
  getUserPosts,
  likePost,
  SocialApiError,
  SocialUnavailableError,
  unlikePost,
} from "@/lib/api/social"
import { getMarketplaceAgents } from "@/lib/api/agents"
import {
  collectCreators,
  creatorDisplayName,
  shortCreatorId,
  type Creator,
} from "@/lib/agents/creator"
import { SESSION_COOKIE } from "@/lib/auth/constants"
import { getCurrentUser } from "@/lib/auth/current-user"
import { getDemoPosts } from "@/lib/social/demo"
import { isMediaUrlValid, MAX_POST_LENGTH } from "@/lib/social/content"
import type {
  ApiPost,
  FeedAuthor,
  FeedPost,
  FeedReason,
  FeedResult,
  SocialResult,
} from "@/lib/social/types"

/** Garde-fous : la timeline est reconstruite à partir d'un appel par auteur et par post. */
const MAX_FOLLOWED = 30
const MAX_RECOMMENDED = 8
const MAX_POSTS = 60

async function getToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof SocialUnavailableError)
    return "The community service is unreachable right now."
  if (error instanceof SocialApiError) {
    if (error.status === 401)
      return "Your session has expired. Please sign in again."
    if (error.status === 403) return "You can't do that on this post."
    if (error.status === 404) return "This post doesn't exist anymore."
    if (error.status === 413) return "This post is too long."
  }
  return fallback
}

type Me = { id: string; author: FeedAuthor }

async function getMe(): Promise<Me | null> {
  const user = await getCurrentUser()
  if (!user) return null
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ")
  return {
    id: user.id,
    author: {
      id: user.id,
      label:
        fullName ||
        (user.username
          ? `@${user.username}`
          : (user.email ?? shortCreatorId(user.id))),
      handle: user.username,
      known: Boolean(user.username || fullName),
    },
  }
}

function creatorAuthor(creator: Creator): FeedAuthor {
  return {
    id: creator.id,
    label: creator.name || creatorDisplayName(creator),
    handle: creator.username,
    known: Boolean(creator.username || creator.name),
  }
}

function unknownAuthor(id: string): FeedAuthor {
  return { id, label: shortCreatorId(id), known: false }
}

function toFeedPost(
  post: ApiPost,
  author: FeedAuthor,
  reason: FeedReason
): FeedPost {
  return {
    id: post.id,
    author,
    content: post.content,
    mediaUrl: post.media_url,
    createdAt: post.created_at,
    likeCount: 0,
    likedByMe: false,
    reason,
  }
}

/**
 * Timeline personnalisée (ODIN-54). L'API social n'a pas de route de feed : on la reconstruit à
 * partir de GET /users/{id}/posts pour le compte connecté, les créateurs suivis (localStorage, passés
 * par le client) et des créateurs recommandés (les plus installés du catalogue marketplace), puis
 * GET /posts/{id}/likes pour chaque post.
 */
export async function loadFeedAction(
  followedIds: string[]
): Promise<FeedResult> {
  const [token, me] = await Promise.all([getToken(), getMe()])
  if (!token || !me) return { source: "signed-out", posts: [], meId: null }

  const creators = await getMarketplaceAgents()
    .then(collectCreators)
    .catch(() => [] as Creator[])
  const creatorsById = new Map(creators.map((creator) => [creator.id, creator]))

  const followed = [...new Set(followedIds)]
    .filter((id) => id !== me.id)
    .slice(0, MAX_FOLLOWED)
  const followedSet = new Set(followed)
  const recommended = creators
    .filter((creator) => creator.id !== me.id && !followedSet.has(creator.id))
    .sort((a, b) => b.installs - a.installs || b.agentCount - a.agentCount)
    .slice(0, MAX_RECOMMENDED)
    .map((creator) => creator.id)

  const sources: { id: string; reason: FeedReason }[] = [
    { id: me.id, reason: "mine" },
    ...followed.map((id) => ({ id, reason: "following" as const })),
    ...recommended.map((id) => ({ id, reason: "recommended" as const })),
  ]

  const results = await Promise.allSettled(
    sources.map(({ id }) => getUserPosts(id, token))
  )

  if (results.every((result) => result.status === "rejected")) {
    const reason = (results[0] as PromiseRejectedResult).reason
    if (reason instanceof SocialUnavailableError) {
      return {
        source: "demo",
        posts: getDemoPosts(),
        meId: me.id,
        notice: "The community service is unreachable: showing demo posts.",
      }
    }
    return {
      source: "api",
      posts: [],
      meId: me.id,
      notice: errorMessage(reason, "Unable to load the feed."),
    }
  }

  const posts = results
    .flatMap((result, i) => {
      if (result.status === "rejected") return []
      const { id, reason } = sources[i]
      const creator = creatorsById.get(id)
      const author =
        reason === "mine"
          ? me.author
          : creator
            ? creatorAuthor(creator)
            : unknownAuthor(id)
      return result.value.map((post) => toFeedPost(post, author, reason))
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_POSTS)

  const likes = await Promise.allSettled(
    posts.map((post) => getPostLikes(post.id, token))
  )
  likes.forEach((result, i) => {
    if (result.status !== "fulfilled") return
    posts[i].likeCount = result.value.length
    posts[i].likedByMe = result.value.some((like) => like.user_id === me.id)
  })

  return { source: "api", posts, meId: me.id }
}

export async function createPostAction(input: {
  content: string
  mediaUrl?: string
}): Promise<SocialResult<FeedPost>> {
  const content = input.content.trim()
  const mediaUrl = input.mediaUrl?.trim() || undefined
  if (!content) return { ok: false, error: "Write something before posting." }
  if (content.length > MAX_POST_LENGTH)
    return {
      ok: false,
      error: `Posts are limited to ${MAX_POST_LENGTH} characters.`,
    }
  if (mediaUrl && !isMediaUrlValid(mediaUrl))
    return { ok: false, error: "The image link must be an https:// URL." }

  const [token, me] = await Promise.all([getToken(), getMe()])
  if (!token || !me) return { ok: false, error: "Sign in to post." }

  try {
    const post = await createPost({ content, media_url: mediaUrl }, token)
    return { ok: true, data: toFeedPost(post, me.author, "mine") }
  } catch (error) {
    return {
      ok: false,
      error: errorMessage(error, "Your post couldn't be published."),
    }
  }
}

export async function deletePostAction(
  postId: string
): Promise<SocialResult<null>> {
  const token = await getToken()
  if (!token) return { ok: false, error: "Sign in to delete this post." }
  try {
    await deletePost(postId, token)
    return { ok: true, data: null }
  } catch (error) {
    return {
      ok: false,
      error: errorMessage(error, "This post couldn't be deleted."),
    }
  }
}

/** Like / unlike. Un 409 (déjà liké) ou un 404 (pas liké) veut dire que l'état voulu est atteint. */
export async function setPostLikeAction(
  postId: string,
  liked: boolean
): Promise<SocialResult<null>> {
  const token = await getToken()
  if (!token) return { ok: false, error: "Sign in to like posts." }
  try {
    await (liked ? likePost : unlikePost)(postId, token)
    return { ok: true, data: null }
  } catch (error) {
    if (
      error instanceof SocialApiError &&
      error.status === (liked ? 409 : 404)
    ) {
      return { ok: true, data: null }
    }
    return {
      ok: false,
      error: errorMessage(error, "Couldn't update your like."),
    }
  }
}
