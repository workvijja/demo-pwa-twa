import CheckDevice from "@/components/utils/checkDevice";
import {FlutterBridgeProvider} from "@/provider/flutterBridgeProvider";
import {UpdateNotifier} from "@/components/utils/updateNotifier";

export default function MainLayout({children}: {children: React.ReactNode}) {
  // return children;
  return (
    <>
      <FlutterBridgeProvider>
        <CheckDevice>
          {children}
        </CheckDevice>
      </FlutterBridgeProvider>
      <UpdateNotifier/>
    </>
  )
}
