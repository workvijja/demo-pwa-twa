import {useEffect, useState} from "react";
import NetworkStatus from "@/lib/networkStatus";

export default function useNetworkStatus(callback?: (status: boolean) => void) {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    setIsOnline(NetworkStatus.status);
    const unsubscribe = NetworkStatus.subscribe((status) => {
      setIsOnline(status);
      callback?.(status)
    })
    return () => unsubscribe();
  }, [isOnline, callback]);

  return isOnline;
}
