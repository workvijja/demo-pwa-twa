"use client";

import { useServiceWorkerUpdate } from "@/hooks/useServiceWorkerUpdate";

export function UpdateNotifier() {
  const { hasUpdate, refresh } = useServiceWorkerUpdate();
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "dev";

  if (!hasUpdate) {
    return (
      <div className="fixed bottom-2 right-2 bg-gray-200 px-2 py-1 rounded text-xs">
        v{version}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex gap-3 items-center">
      <span>🚀 New version available (v{version})</span>
      <button
        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
        onClick={refresh}
      >
        Refresh
      </button>
    </div>
  );
}
