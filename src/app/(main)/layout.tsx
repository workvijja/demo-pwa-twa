import Link from "next/link";

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-10">
        <nav className="p-4 flex gap-4">
          <Link href="/v1">V1</Link>
          <Link href="/v2">V2</Link>
        </nav>
      </header>
      {children}
    </>
  )
}
