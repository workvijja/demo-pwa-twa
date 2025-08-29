"use client"

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function CheckDevice({children}: {children: React.ReactNode}) {
  const [permit, setPermit] = useState(false);
  const router = useRouter();

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

    if (!(channelName in window)) {
      router.replace('/download');
      return;
    }

    setPermit(true);
  }, []);

  if (!permit) return null;

  return children;
}
