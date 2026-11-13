import { NotFoundScreen } from "@/components/status/not-found-screen"

export default function CreatorNotFound() {
  return (
    <NotFoundScreen
      eyebrow="Creator not found"
      title={
        <>
          No creator <span className="fx-gradient-text">by that id</span>.
        </>
      }
      description="This link doesn't point to a valid creator profile. Find agents and their creators in the marketplace."
      lines={[
        { kind: "command", text: "odin creator <id>" },
        { kind: "output", text: "searching the registry…" },
        { kind: "error", text: "invalid creator id" },
      ]}
    />
  )
}
