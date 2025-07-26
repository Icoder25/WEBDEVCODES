import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Shubham Enterprises - Premium Cosmetics B2B Wholesale',
    template: '%s | Shubham Enterprises'
  },
  description: 'Leading B2B wholesale supplier of premium cosmetics, beauty products, and personal care items. Competitive pricing, quality assurance, and nationwide delivery for retailers and resellers.',
  keywords: ['cosmetics wholesale', 'beauty products B2B', 'makeup wholesale', 'skincare wholesale', 'cosmetics supplier', 'beauty distributor'],
  authors: [{ name: 'Shubham Enterprises' }],
  creator: 'Shubham Enterprises',
  publisher: 'Shubham Enterprises',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://shubham-enterprises.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shubham-enterprises.vercel.app',
    title: 'Shubham Enterprises - Premium Cosmetics B2B Wholesale',
    description: 'Leading B2B wholesale supplier of premium cosmetics and beauty products.',
    siteName: 'Shubham Enterprises',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Shubham Enterprises - Cosmetics Wholesale',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shubham Enterprises - Premium Cosmetics B2B Wholesale',
    description: 'Leading B2B wholesale supplier of premium cosmetics and beauty products.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(inter.variable, poppins.variable)}>

      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        'selection:bg-primary/20 selection:text-primary-900'
      )}>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#00bcd4',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}