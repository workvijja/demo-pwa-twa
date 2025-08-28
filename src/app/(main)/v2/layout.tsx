import Link from "next/link";

export default function V2Layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-10 bg-white shadow-md">
        <nav className="p-4 flex gap-6 justify-center">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/v2" className="hover:text-blue-600">V2</Link>
          <Link href="/v2/features" className="hover:text-blue-600">Features</Link>
          <Link href="/v2/gallery" className="hover:text-blue-600">Gallery</Link>
          <Link href="/v2/about" className="hover:text-blue-600">About</Link>
          <Link href="/v2/contact" className="hover:text-blue-600">Contact</Link>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </>
  )
}
