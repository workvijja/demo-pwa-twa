"use client"

import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";

export default function CheckDevice({children}: {children: React.ReactNode}) {
  const [permit, setPermit] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setPermit(true);
      return;
    }

    if (typeof window === 'undefined') {
      router.replace('/download');
      return;
    }

    const channelName = process.env.NEXT_PUBLIC_FLUTTER_CHANNEL_NAME || 'pwaToFlutterChannel';
    const expectedUserAgent = process.env.NEXT_PUBLIC_FLUTTER_USER_AGENT || 'flutter_x_pwa';

    if (navigator.userAgent !== expectedUserAgent) {
      router.replace('/download');
      return;
    }

    window.flutterToPwaChannel = (message: string) => {
      window.postMessage(message, '*');
    }

    const checkMessage = (e: MessageEvent) => {
      if (e.data !== process.env.NEXT_PUBLIC_FLUTTER_MESSAGE) {
        console.error('Invalid message received')
        router.replace('/download');
        return;
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPermit(true);
    }

    window.addEventListener('message', checkMessage);
    timeoutRef.current = setTimeout(() => {
      console.error('Timeout: Flutter message not received');
      router.replace('/download');
      window.removeEventListener('message', checkMessage);
      setPermit(false); // Optional: Set permit to false when timeout occurs
    }, 10 * 1000);

    return () => {
      window.removeEventListener('message', checkMessage);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!permit) return null;

  return children;
}
