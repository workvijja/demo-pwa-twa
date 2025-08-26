"use client"

export default function GalleryPage() {
  return (
    <main className="min-h-screen flex flex-wrap gap-4 *:w-[calc(50%-0.5rem)] p-4">
      {
        Array.from({length: 8}).map((_, index) => (
          <img key={index} height={"auto"} src={`/gallery/${index + 1}.jpg`} alt={`Image ${index}`}/>
        ))
      }
    </main>
  )
}
