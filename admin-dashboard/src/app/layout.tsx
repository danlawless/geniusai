import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GeniusAI Admin Dashboard',
  description: 'Professional admin dashboard for the GeniusAI platform',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-dark-900 antialiased`}>
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  )
} 