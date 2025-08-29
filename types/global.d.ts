export {};

declare global {
  interface Window {
    pwaToFlutterChannel?: (message: string) => void;
    flutterToPwaChannel?: (message: string) => void;
    flutter_inappwebview?: {
      callHandler: <T = unknown>(
        handlerName: string,
        ...args: unknown[]
      ) => Promise<T>;
    };
  }
}
