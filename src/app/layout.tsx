import type {Metadata, Viewport} from 'next';
import './globals.css';
import { BottomNav } from "@/components/shared/bottom-nav"
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from "@/firebase/client-provider"

export const metadata: Metadata = {
  title: 'AuraFlow | AI-Powered Student Productivity',
  description: 'Your intelligent study hub for academic excellence and career growth.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AuraFlow',
  },
  formatDetection: {
    telephone: false,
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-body bg-[#0A0714] text-foreground antialiased min-h-screen overflow-x-hidden">
        <FirebaseClientProvider>
          <div className="flex flex-col min-h-screen w-full relative">
            <main className="flex-1 pb-32 overflow-y-auto safe-area-inset-top">
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
