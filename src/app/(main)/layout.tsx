import CheckDevice from "@/components/utils/checkDevice";
import {UpdateNotifier} from "@/components/utils/updateNotifier";

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <CheckDevice>
      {children}
      <UpdateNotifier/>
    </CheckDevice>
  )
}
