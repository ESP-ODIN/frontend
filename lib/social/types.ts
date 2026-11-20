/** Post tel que le renvoie l'API social (model.Post). */
export type ApiPost = {
  id: string
  author_id: string
  content: string
  media_url: string | null
  created_at: string
  updated_at: string
}

/** Like tel que le renvoie l'API social (model.Like). */
export type ApiLike = {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

/**
 * Genre d'un post. L'API n'a pas de champ pour ça : il est déduit d'un hashtag du contenu
 * (#faq, #tutorial, #rex), « general » sinon.
 */
export type PostKind = "general" | "faq" | "tutorial" | "rex"

/** Pourquoi le post est dans la timeline de l'utilisateur. */
export type FeedReason = "mine" | "following" | "recommended"

export type FeedAuthor = {
  id: string
  /** "@pseudo", "Prénom N." ou le début de l'id quand on ne connaît rien d'autre. */
  label: string
  handle?: string
  /** false : seul l'id est connu (DevMark). */
  known: boolean
}

export type FeedPost = {
  id: string
  author: FeedAuthor
  content: string
  mediaUrl: string | null
  createdAt: string
  likeCount: number
  likedByMe: boolean
  reason: FeedReason
}

export type FeedSource = "api" | "demo" | "signed-out"

export type FeedResult = {
  source: FeedSource
  posts: FeedPost[]
  /** Id du compte connecté, null sans session. */
  meId: string | null
  /** Message quand l'API social n'a pas répondu et que le feed retombe sur la démo. */
  notice?: string
}

export type SocialResult<T> =
  { ok: true; data: T } | { ok: false; error: string }
