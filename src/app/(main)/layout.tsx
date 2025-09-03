import CheckDevice from "@/components/utils/checkDevice";
import {FlutterBridgeProvider} from "@/provider/flutterBridgeProvider";
import {UpdateNotifier} from "@/components/utils/updateNotifier";
import QueryProvider from "@/provider/queryProvider";
import {AuthProvider} from "@/provider/authProvider";
import Header from "@/app/(main)/_feature/header";

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <QueryProvider>
      <FlutterBridgeProvider>
        <CheckDevice>
          <AuthProvider>
            <Header/>
            {children}
          </AuthProvider>
        </CheckDevice>
      </FlutterBridgeProvider>
      <UpdateNotifier/>
    </QueryProvider>
  )
}
