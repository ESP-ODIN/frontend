import { getAppPages } from "@/lib/app-pages"

export async function GET() {
  const pages = await getAppPages()
  return Response.json({ data: pages })
}
