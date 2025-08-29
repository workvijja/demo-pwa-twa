import CheckDevice from "@/components/utils/checkDevice";

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <CheckDevice>
      {children}
    </CheckDevice>
  )
}
