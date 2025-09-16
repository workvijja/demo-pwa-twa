import {useEffect, useRef} from "react";
import NetworkStatus from "@/lib/networkStatus";
import {toast} from "sonner";

export default function useNetworkStatus(callback?: (isOnline: boolean) => void) {
  const isOnlineRef = useRef(NetworkStatus.status);
  useEffect(() => {
    const unsubscribe = NetworkStatus.subscribe((isOnline) => {
      if (isOnlineRef.current !== isOnline) {
        isOnlineRef.current = isOnline;
        toast.info(isOnline ? "You're online now" : "You're offline now")
      }
      callback?.(isOnline)
    })
    return () => unsubscribe();
  }, []);
}
