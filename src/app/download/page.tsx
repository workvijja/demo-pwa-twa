'use client';

import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';

export default function DownloadPage() {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'unknown'>('unknown');

  useEffect(() => {
    // Detect user's device
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);

    if (isAndroid) {
      setDeviceType('android');
    } else if (isIOS) {
      setDeviceType('ios');
    }
  }, []);

  // App Store and Play Store links - replace with your actual app links
  const playStoreLink = 'https://play.google.com/store/apps/details?id=YOUR_APP_ID';
  const appStoreLink = 'https://apps.apple.com/app/your-app-id';

  const handleDownload = () => {
    if (deviceType === 'android') {
      window.location.href = playStoreLink;
    } else if (deviceType === 'ios') {
      window.location.href = appStoreLink;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Download Our App</h1>
        <p className="text-muted-foreground">
          Get the best experience by downloading our mobile app
        </p>

        {deviceType === 'unknown' ? (
          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full bg-[#0F9D58] hover:bg-[#0b8043]"
              onClick={() => window.open(playStoreLink, '_blank')}
            >
              <svg className="size-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path fill="currentColor" d="M 7.6230469 3.2109375 L 18 13.585938 L 20.677734 10.908203 C 17.018734 8.6882031 12.118063 5.7100938 9.9140625 4.3710938 L 8.4375 3.4765625 C 8.1765 3.3175625 7.8970469 3.2319375 7.6230469 3.2109375 z M 6.0390625 4.453125 C 6.0180625 4.567125 6 4.6816875 6 4.8046875 L 6 25.308594 C 6 25.394594 6.0172969 25.474641 6.0292969 25.556641 L 16.585938 15 L 6.0390625 4.453125 z M 22.4375 11.976562 L 19.414062 15 L 22.384766 17.970703 C 23.958766 17.016703 25.048922 16.35425 25.169922 16.28125 C 25.704922 15.95425 26.007047 15.460875 25.998047 14.921875 C 25.990047 14.392875 25.687828 13.919906 25.173828 13.628906 C 25.058828 13.562906 23.9835 12.913563 22.4375 11.976562 z M 18 16.414062 L 7.6542969 26.759766 C 7.8552969 26.724766 8.0560469 26.664828 8.2480469 26.548828 C 8.5140469 26.386828 15.7 22.027062 20.625 19.039062 L 18 16.414062 z"/>
              </svg>
              Download on Google Play
            </Button>
            <Button
              size="lg"
              className="w-full bg-black hover:bg-gray-800"
              onClick={() => window.open(appStoreLink, '_blank')}
            >
              <svg className="size-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path fill="currentColor" d="M25.565,9.785c-0.123,0.077-3.051,1.702-3.051,5.305c0.138,4.109,3.695,5.55,3.756,5.55 c-0.061,0.077-0.537,1.963-1.947,3.94C23.204,26.283,21.962,28,20.076,28c-1.794,0-2.438-1.135-4.508-1.135 c-2.223,0-2.852,1.135-4.554,1.135c-1.886,0-3.22-1.809-4.4-3.496c-1.533-2.208-2.836-5.673-2.882-9 c-0.031-1.763,0.307-3.496,1.165-4.968c1.211-2.055,3.373-3.45,5.734-3.496c1.809-0.061,3.419,1.242,4.523,1.242 c1.058,0,3.036-1.242,5.274-1.242C21.394,7.041,23.97,7.332,25.565,9.785z M15.001,6.688c-0.322-1.61,0.567-3.22,1.395-4.247 c1.058-1.242,2.729-2.085,4.17-2.085c0.092,1.61-0.491,3.189-1.533,4.339C18.098,5.937,16.488,6.872,15.001,6.688z"/>
              </svg>
              Download on the App Store
            </Button>
          </div>
        ) : (
          <Button
            size="lg"
            className="w-full"
            onClick={handleDownload}
          >
            {deviceType === 'android' ? (
              <>
                <svg className="size-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                  <path fill="currentColor" d="M 7.6230469 3.2109375 L 18 13.585938 L 20.677734 10.908203 C 17.018734 8.6882031 12.118063 5.7100938 9.9140625 4.3710938 L 8.4375 3.4765625 C 8.1765 3.3175625 7.8970469 3.2319375 7.6230469 3.2109375 z M 6.0390625 4.453125 C 6.0180625 4.567125 6 4.6816875 6 4.8046875 L 6 25.308594 C 6 25.394594 6.0172969 25.474641 6.0292969 25.556641 L 16.585938 15 L 6.0390625 4.453125 z M 22.4375 11.976562 L 19.414062 15 L 22.384766 17.970703 C 23.958766 17.016703 25.048922 16.35425 25.169922 16.28125 C 25.704922 15.95425 26.007047 15.460875 25.998047 14.921875 C 25.990047 14.392875 25.687828 13.919906 25.173828 13.628906 C 25.058828 13.562906 23.9835 12.913563 22.4375 11.976562 z M 18 16.414062 L 7.6542969 26.759766 C 7.8552969 26.724766 8.0560469 26.664828 8.2480469 26.548828 C 8.5140469 26.386828 15.7 22.027062 20.625 19.039062 L 18 16.414062 z"/>
                </svg>
                Download on Google Play
              </>
            ) : (
              <>
                <svg className="size-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                  <path fill="currentColor" d="M25.565,9.785c-0.123,0.077-3.051,1.702-3.051,5.305c0.138,4.109,3.695,5.55,3.756,5.55 c-0.061,0.077-0.537,1.963-1.947,3.94C23.204,26.283,21.962,28,20.076,28c-1.794,0-2.438-1.135-4.508-1.135 c-2.223,0-2.852,1.135-4.554,1.135c-1.886,0-3.22-1.809-4.4-3.496c-1.533-2.208-2.836-5.673-2.882-9 c-0.031-1.763,0.307-3.496,1.165-4.968c1.211-2.055,3.373-3.45,5.734-3.496c1.809-0.061,3.419,1.242,4.523,1.242 c1.058,0,3.036-1.242,5.274-1.242C21.394,7.041,23.97,7.332,25.565,9.785z M15.001,6.688c-0.322-1.61,0.567-3.22,1.395-4.247 c1.058-1.242,2.729-2.085,4.17-2.085c0.092,1.61-0.491,3.189-1.533,4.339C18.098,5.937,16.488,6.872,15.001,6.688z"/>
                </svg>
                Download on the App Store
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
