"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-xs relative pt-16">
        <div className="absolute top-0 left-1/2 -translate-1/2 flex size-24 items-center justify-center rounded-full bg-muted">
          <WifiOff className="size-10 text-muted-foreground"/>
        </div>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">You're offline</CardTitle>
          <CardDescription>
            We couldn't connect to the internet. Check your connection and try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>Don't worry, your content will sync when you're back online.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleRetry}
          >
            <RefreshCw/>
            Try again
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
