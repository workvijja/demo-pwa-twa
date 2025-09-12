import CheckDevice from "@/components/utils/checkDevice";
import {FlutterBridgeProvider} from "@/provider/flutterBridgeProvider";
import {UpdateNotifier} from "@/components/utils/updateNotifier";
import QueryProvider from "@/provider/queryProvider";
// import {AuthProvider} from "@/provider/authProvider";
import Header from "@/app/(main)/_feature/header";

const componentAllowed = <T extends object>(allowed: boolean, Comp: React.FC<T>) =>
  allowed ? Comp : ({children}: {children: React.ReactNode}) => <>{children}</>;

const CheckDeviceWrapper = componentAllowed(
  process.env.NEXT_PUBLIC_ENABLE_CHECK_DEVICE === "true",
  CheckDevice
);

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <QueryProvider>
      <FlutterBridgeProvider>
        <CheckDeviceWrapper>
          <Header/>
          {children}
        </CheckDeviceWrapper>
      </FlutterBridgeProvider>
      <UpdateNotifier/>
    </QueryProvider>
  )
}
