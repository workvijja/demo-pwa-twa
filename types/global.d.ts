export {};

declare global {
  interface Window {
    pwaToFlutterChannel?: (message: string) => void;
    flutterToPwaChannel?: (message: string) => void;
  }
}
