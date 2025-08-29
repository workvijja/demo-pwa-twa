"use client"

import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useFlutterBridge} from "@/provider/flutterBridgeProvider";

export default function CheckDevice({children}: {children: React.ReactNode}) {
  const [permit, setPermit] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const {isReady, callHandler} = useFlutterBridge();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setPermit(true);
      return;
    }

    if (typeof window === 'undefined') {
      router.replace('/download');
      return;
    }

    const expectedUserAgent = process.env.NEXT_PUBLIC_FLUTTER_USER_AGENT || 'flutter_x_pwa';

    if (navigator.userAgent !== expectedUserAgent) {
      router.replace('/download');
      return;
    }

    // Only proceed if Flutter bridge is ready
    if (!isReady) return;

    const checkFlutterResponse = async () => {
      try {
        const response = await Promise.race([
          callHandler('pwaToFlutterChannel'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10 * 1000)
          )
        ]) as { status: string; message: string };

        if (response?.status === 'success') {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setPermit(true);
        } else {
          console.error('Invalid response status:', response?.status);
          router.replace('/download');
        }
      } catch (error) {
        console.error('Error calling pwaToFlutterChannel:', error);
        router.replace('/download');
      }
    };

    checkFlutterResponse();
  }, [isReady]);

  if (!permit) return null;

  return children;
}
