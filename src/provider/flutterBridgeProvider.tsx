import React, { createContext, useContext, useEffect, useState } from "react";

type FlutterBridgeContextType = {
  isReady: boolean;
  callHandler: <T = unknown>(handlerName: string, ...args: unknown[]) => Promise<T | null>;
};

const FlutterBridgeContext = createContext<FlutterBridgeContextType | null>(null);

export const FlutterBridgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Already available?
    if (window.flutter_inappwebview) {
      setIsReady(true);
      return;
    }

    const handleReady = () => setIsReady(true);

    window.addEventListener("flutterInAppWebViewPlatformReady", handleReady);

    return () => {
      window.removeEventListener("flutterInAppWebViewPlatformReady", handleReady);
    };
  }, []);

  const callHandler = async <T,>(handlerName: string, ...args: unknown[]): Promise<T | null> => {
    if (!isReady || !window.flutter_inappwebview?.callHandler) {
      console.warn(`Flutter handler not ready yet.`);
      return null;
    }
    try {
      return await window.flutter_inappwebview.callHandler<T>(handlerName, ...args);
    } catch (err) {
      console.error(`Error calling Flutter handler "${handlerName}":`, err);
      return null;
    }
  };

  return (
    <FlutterBridgeContext.Provider value={{ isReady, callHandler }}>
      {children}
    </FlutterBridgeContext.Provider>
  );
};

export const useFlutterBridge = () => {
  const ctx = useContext(FlutterBridgeContext);
  if (!ctx) {
    throw new Error("useFlutterBridge must be used within a FlutterBridgeProvider");
  }
  return ctx;
};
