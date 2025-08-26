import Link from "next/link";


export default function V1Layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-10">
        <nav className="p-4 flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/v1">V1</Link>
          <Link href="/v1/box-breathing">Box Breathing</Link>
          <Link href="/v1/gallery">Gallery</Link>
          <Link href="/v1/a">A</Link>
          <Link href="/v1/b">B</Link>
          <Link href="/v1/c">C</Link>
        </nav>
      </header>
      {children}
    </>
  )
}
