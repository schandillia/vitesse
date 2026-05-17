import { NextResponse } from "next/server"

import { getDocMarkdown } from "@/lib/docs/get-doc-markdown"

type Params = Promise<{
  slug?: string[]
}>

export async function GET(request: Request, { params }: { params: Params }) {
  const { slug } = await params

  const markdown = await getDocMarkdown(slug)

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
