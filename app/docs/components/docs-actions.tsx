"use client"

import {
  ChevronDownIcon,
  ExternalLinkIcon,
  TextAlignStartIcon,
} from "lucide-react"
import { BsClaude } from "react-icons/bs"
import { FaGithub } from "react-icons/fa"
import { PiOpenAiLogoLight } from "react-icons/pi"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  githubUrl?: string
  markdownUrl?: string
}

type Action = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export function DocsActions({ githubUrl, markdownUrl }: Props) {
  const origin = typeof window !== "undefined" ? window.location.origin : ""

  const actions: Action[] = [
    ...(markdownUrl
      ? [
          {
            label: "View as Markdown",
            href: markdownUrl,
            icon: TextAlignStartIcon,
          },
        ]
      : []),

    ...(githubUrl
      ? [
          {
            label: "Open in GitHub",
            href: githubUrl,
            icon: FaGithub,
          },
        ]
      : []),

    ...(markdownUrl
      ? [
          {
            label: "Open in ChatGPT",
            href: `https://chatgpt.com/?prompt=${encodeURIComponent(
              `Read ${origin}${markdownUrl}, I want to ask questions about it.`
            )}`,
            icon: PiOpenAiLogoLight,
          },
          {
            label: "Open in Claude",
            href: `https://claude.ai/new?q=${encodeURIComponent(
              `Read ${origin}${markdownUrl}, I want to ask questions about it.`
            )}`,
            icon: BsClaude,
          },
        ]
      : []),
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <span>Open</span>

          <ChevronDownIcon className="size-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-full">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <DropdownMenuItem key={action.label} asChild>
              <a
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />

                  <span>{action.label}</span>
                </div>

                <ExternalLinkIcon className="size-4 opacity-70" />
              </a>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
