export {};

declare global {
  interface Window {
    pwaToFlutterChannel?: {
      postMessage: (message: any) => void;
    };
  }
}
