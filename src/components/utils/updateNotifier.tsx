"use client";

import {useServiceWorkerUpdate} from "@/hooks/useServiceWorkerUpdate";
import {Badge} from "@/components/ui/badge";
import {useEffect} from "react";
import {toast} from "sonner";

export function UpdateNotifier() {
  const { hasUpdate, refresh } = useServiceWorkerUpdate();
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "dev";

  useEffect(() => {
    if (!hasUpdate) return;
    toast.info(`New version available (v${version})`, {
      icon: '🚀',
      action: {
        label: 'Refresh',
        onClick: refresh,
      },
      duration: Infinity,
      closeButton: true
    });
  }, [hasUpdate, refresh, version]);

  return (
    <Badge className="fixed bottom-2 right-2" variant="secondary">
      v{version}
    </Badge>
  );
}
