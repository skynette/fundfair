import '@/styles/globals.css'
import { Inter } from "next/font/google"
import { cn } from '@/lib/utils'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
    subsets: ['latin']
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={cn('', inter.className)}>
            <body className=''>
                {children}
            </body>
            <Toaster />
        </html>
    )
}
