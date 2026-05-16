import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AuraFlow | AI-Powered Student Productivity',
  description: 'Your intelligent study hub for academic excellence and career growth.',
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
      </head>
      <body className="font-body bg-background text-foreground antialiased min-h-screen pb-20 md:pb-0">
        {children}
      </body>
    </html>
  );
}
