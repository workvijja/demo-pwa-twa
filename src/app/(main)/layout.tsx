"use client"

import CheckDevice from "@/components/utils/checkDevice";
import {FlutterBridgeProvider} from "@/provider/flutterBridgeProvider";
import {UpdateNotifier} from "@/components/utils/updateNotifier";
import QueryProvider from "@/provider/queryProvider";
import Header from "@/app/(main)/_feature/header";
import useNetworkStatus from "@/hooks/useNetworkStatus";

const componentAllowed = <T extends object>(allowed: boolean, Comp: React.FC<T>) =>
  allowed ? Comp : ({children}: {children: React.ReactNode}) => <>{children}</>;

const CheckDeviceWrapper = componentAllowed(
  process.env.NEXT_PUBLIC_ENABLE_CHECK_DEVICE === "true",
  ({children}: {children: React.ReactNode}) => (
    <FlutterBridgeProvider>
      <CheckDevice>
        {children}
      </CheckDevice>
    </FlutterBridgeProvider>
  )
);

export default function MainLayout({children}: {children: React.ReactNode}) {
  useNetworkStatus();

  return (
    <QueryProvider>
      <CheckDeviceWrapper>
        <Header/>
        {children}
      </CheckDeviceWrapper>
      <UpdateNotifier/>
    </QueryProvider>
  )
}
