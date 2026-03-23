import { AuthProvider } from "@/components/auth/AuthProvider";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { ChatWidget } from "@/components/ChatWidget";
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://ascendproperties.lk'),
  title: {
    default: 'Ascend Properties | Luxury Real Estate in Sri Lanka',
    template: '%s | Ascend Properties'
  },
  description: 'Discover luxury apartments, houses, and lands for sale and rent in Colombo and across Sri Lanka. Your trusted partner for premium real estate.',
  keywords: ['Real Estate Sri Lanka', 'Colombo Apartments', 'Luxury Houses', 'Land for Sale', 'Commercial Property'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ascendproperties.lk',
    siteName: 'Ascend Properties',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ascend Properties',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        <AuthProvider>
          {children}
          <FloatingWhatsApp />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  )
}
