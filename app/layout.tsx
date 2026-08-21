import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Thai } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const thai = Noto_Sans_Thai({ subsets: ['thai'], variable: '--font-thai' })

export const metadata: Metadata = {
  title: 'Excel Analytics Dashboard',
  description: 'วิเคราะห์และสรุปข้อมูลจากไฟล์ Excel ภายในเบราว์เซอร์',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f8fa',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th" className="bg-background"><body className={`${geist.variable} ${geistMono.variable} ${thai.variable} font-sans antialiased`}>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
