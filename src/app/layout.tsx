import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

export const metadata: Metadata = {
  title: 'Dev-X-Restro',
  description: 'Customize your food orders with precision.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
        <Toaster />
        <footer className="mt-auto py-6 px-4 bg-secondary text-center">
          <p className="text-sm font-medium text-secondary-foreground">
            Powered By <span className="font-bold text-primary">Agora</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
