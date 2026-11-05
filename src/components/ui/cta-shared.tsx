"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface CtaProps {
  ctaEnabled: boolean
  text: string
  link: string
  variant?: "default" | "outline" | "link"
  size?: "default" | "sm" | "lg"
}

/** Shared call-to-action used by the Hero 04 / 10 / 12 registry blocks (their helper file was not published). */
export function Cta({
  cta,
  className,
  invert = false,
}: {
  cta: CtaProps
  className?: string
  invert?: boolean
}) {
  if (!cta.ctaEnabled) return null
  const { variant = "default", size = "default", text, link } = cta
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
  const sizes = { sm: "h-9 px-4 text-sm", default: "h-11 px-6 text-sm", lg: "h-12 px-8 text-base" }
  const variants = {
    default: invert
      ? "rounded-full bg-foreground text-background hover:bg-foreground/90"
      : "rounded-full bg-gold text-primary-foreground hover:bg-gold-deep",
    outline: invert
      ? "rounded-full border border-white/40 text-white hover:bg-white/10"
      : "rounded-full border border-[#e6dfd2] text-foreground hover:border-gold hover:text-gold",
    link: invert
      ? "text-white underline-offset-4 hover:underline"
      : "text-foreground underline-offset-4 hover:text-gold hover:underline",
  }
  const cls = cn(base, variant === "link" ? "" : sizes[size], variants[variant], className)
  const external = /^https?:/.test(link)
  if (external || link.startsWith("#") || link.startsWith("tel:") || link.startsWith("mailto:"))
    return (
      <a href={link || "#"} className={cls} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {text}
      </a>
    )
  return (
    <Link href={link || "/"} className={cls}>
      {text}
    </Link>
  )
}

export default Cta
