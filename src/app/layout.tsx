// src/app/layout.tsx

import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from '../components/NavBar'

const geistSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Inter({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'True Ballot',
  description: 'Secure University Voting System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* NavBar handles all navigation and auth buttons now */}
          <NavBar />
          
          {/* Main Content */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}