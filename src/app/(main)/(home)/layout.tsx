'use client';

import Link from "next/link";
import dynamic from "next/dynamic";
const ProfileDropdown = dynamic(
  () => import("@/components/profile/ProfileDropdown"),
  {ssr: false}
);

export default function HomeLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <nav className="p-4 flex justify-between items-center">
          <div className="flex gap-4">
            <Link href="/v1">V1</Link>
            <Link href="/v2">V2</Link>
          </div>
          <div className="flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </>
  )
}
