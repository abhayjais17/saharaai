import type { Metadata, Viewport } from 'next'
import { Mukta, Tiro_Devanagari_Hindi } from 'next/font/google'
import { LanguageProvider } from '@/components/LanguageProvider'
import { AppShell } from '@/components/AppShell'
import { t } from '@/lib/i18n'
import './globals.css'

const display = Tiro_Devanagari_Hindi({
  subsets: ['devanagari', 'latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const ui = Mukta({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-ui',
  display: 'swap',
})

export const metadata: Metadata = {
  title: t('meta.title'),
  description: t('meta.description'),
  openGraph: {
    title: t('meta.title'),
    description: t('meta.description'),
    siteName: 'Sahara AI',
    type: 'website',
    locale: 'en_IN',
    alternateLocale: 'hi_IN',
  },
  twitter: { card: 'summary', title: t('meta.title'), description: t('meta.description') },
  applicationName: 'सहारा AI',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'सहारा AI' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B3B38', // forest-900 token
  colorScheme: 'light',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable}`}>
      <body className="antialiased">
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  )
}
