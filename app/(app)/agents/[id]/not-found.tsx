import { NotFoundScreen } from "@/components/status/not-found-screen"

export default function AgentNotFound() {
  return (
    <NotFoundScreen
      eyebrow="Agent not found"
      title={
        <>
          No agent <span className="fx-gradient-text">by that id</span>.
        </>
      }
      description="This agent doesn't exist or was unpublished from the registry. Look for an alternative in the marketplace."
      lines={[
        { kind: "command", text: "odin info <agent>" },
        { kind: "output", text: "searching the registry…" },
        { kind: "error", text: "agent not found" },
      ]}
    />
  )
}
