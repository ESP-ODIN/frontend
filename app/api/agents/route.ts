import { getMarketplaceAgents } from "@/lib/api/agents"

export async function GET() {
  const agents = await getMarketplaceAgents()
  return Response.json({ data: agents })
}
