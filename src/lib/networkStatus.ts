"use client"

export type NetworkCallback = (status: boolean) => void;

class NetworkStatus {
  private static instance: NetworkStatus;
  private pingUrl!: string;
  private interval!: number;
  private isOnline!: boolean;
  private listeners!: Set<NetworkCallback>;
  private timer!: ReturnType<typeof setInterval> | null;

  private constructor(
    pingUrl: string = "https://www.gstatic.com/generate_204",
    interval: number = 10 * 1000
  ) {
    if (NetworkStatus.instance) {
      return NetworkStatus.instance;
    }

    this.pingUrl = pingUrl;
    this.interval = interval;
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.listeners = new Set();
    this.timer = null;

    // Bind browser events
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        console.log("listener online", new Date())
        this.verifyStatus()
      });
      window.addEventListener("offline", () => {
        console.log("listener offline", new Date())
        this.updateStatus(false)
      });
    }

    // Start periodic checks if initially online
    if (this.isOnline) {
      this.startMonitoring();
    }

    NetworkStatus.instance = this;
  }

  private async checkInternet(): Promise<boolean> {
    try {
      await fetch(this.pingUrl, { method: "HEAD", mode: "no-cors", cache: "no-store" });
      return true; // success if no exception
    } catch {
      return false;
    }
  }

  private async verifyStatus(): Promise<void> {
    const reallyOnline = await this.checkInternet();
    this.updateStatus(reallyOnline);

    if (reallyOnline) {
      this.startMonitoring();
    } else {
      this.stopMonitoring();
    }
  }

  private updateStatus(status: boolean): void {
    if (this.isOnline !== status) {
      this.isOnline = status;
      this.listeners.forEach((cb) => cb(status));
    }
  }

  private startMonitoring(): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.verifyStatus(), this.interval);
  }

  private stopMonitoring(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public subscribe(callback: NetworkCallback): () => void {
    this.listeners.add(callback);
    callback(this.isOnline); // fire immediately
    return () => this.listeners.delete(callback);
  }

  public get status(): boolean {
    return this.isOnline;
  }

  // Singleton accessor
  public static getInstance(): NetworkStatus {
    if (!NetworkStatus.instance) {
      NetworkStatus.instance = new NetworkStatus();
    }
    return NetworkStatus.instance;
  }
}

// Export a single shared instance
const networkStatus = NetworkStatus.getInstance();
export default networkStatus;
