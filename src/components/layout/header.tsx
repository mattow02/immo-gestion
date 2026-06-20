"use client"

import { MobileNav } from "./mobile-nav"

export function Header({ title, mobileNav }: { title?: string; mobileNav?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-6">
      {mobileNav || <MobileNav />}
      {title && <h1 className="text-lg font-semibold">{title}</h1>}
    </header>
  )
}
