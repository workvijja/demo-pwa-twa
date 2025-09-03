'use client';

import Link from "next/link";

export default function HomeLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <header className="sticky top-17 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <nav className="px-4 py-2 flex gap-4 items-center">
          <Link href="/v1">V1</Link>
          <Link href="/v2">V2</Link>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </>
  )
}
