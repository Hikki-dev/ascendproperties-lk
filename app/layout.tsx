import { AuthProvider } from "@/components/auth/AuthProvider";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import ChatWidget from "@/components/ChatWidget";
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <FloatingWhatsApp />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  )
}