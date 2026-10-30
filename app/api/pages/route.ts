import { getAppPages } from "@/lib/navigation/app-pages"

export async function GET() {
  const pages = await getAppPages()
  return Response.json({ data: pages })
}
