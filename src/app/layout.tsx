import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Card Fortune | High-Stakes Mystery Game',
  description: 'Test your luck in the ultimate 3x3 mystery card challenge.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}