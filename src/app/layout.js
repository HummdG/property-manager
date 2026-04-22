import { DM_Sans, Plus_Jakarta_Sans, Geist_Mono, Cormorant_Garamond } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata = {
  metadataBase: new URL('https://www.imperviaestates.com'),
  title: 'Impervia Estates | UAE Premium Property Management',
  description: 'Established property management and real estate services across the UAE. RERA licensed. Trusted by owners, agents, and tenants across Dubai and beyond.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '48x48' },
    ],
    apple: { url: '/icon.svg', type: 'image/svg+xml' },
  },
  openGraph: {
    title: 'Impervia Estates | UAE Premium Property Management',
    description: 'Established property management and real estate services across the UAE. RERA licensed. Trusted by owners, agents, and tenants across Dubai and beyond.',
    siteName: 'Impervia Estates',
    locale: 'en_AE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Impervia Estates | UAE Premium Property Management',
    description: 'Established property management and real estate services across the UAE. RERA licensed. Trusted by owners, agents, and tenants across Dubai and beyond.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${jakarta.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
