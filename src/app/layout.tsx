import type {Metadata, Viewport} from 'next';
import './globals.css';
import { BottomNav } from "@/components/shared/bottom-nav"
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from "@/firebase/client-provider"

export const metadata: Metadata = {
  title: 'AuraFlow | Elite Student Hub',
  description: 'High-velocity study ecosystem for academic excellence.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AuraFlow',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0714',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-[#040308] text-foreground antialiased min-h-svh overflow-x-hidden selection:bg-primary/20">
        <FirebaseClientProvider>
          <div className="flex flex-col min-h-svh w-full relative">
            <main className="flex-1 pb-32 md:pb-40 overflow-y-auto safe-area-top">
              {children}
            </main>
            <BottomNav />
          </div>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
