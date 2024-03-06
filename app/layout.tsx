'use client';

import './globals.css'
import { Epilogue } from "next/font/google"
import { cn } from '@/lib/utils'
import {
    ThirdwebProvider,
    metamaskWallet,
    coinbaseWallet,
    walletConnect,
    embeddedWallet,
    zerionWallet,
    rainbowWallet,
    phantomWallet,
    en,
} from "@thirdweb-dev/react";
import Navbar from './components/layout/navbar';
import { Toaster } from './components/ui/sonner';


const epilogue = Epilogue({
    subsets: ['latin']
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={cn('', epilogue.className)}>
            <body className=''>
                <ThirdwebProvider
                    activeChain="mumbai"
                    clientId={process.env.NEXT_THIRDWEB_CLIENT_ID}
                    locale={en()}
                    supportedWallets={[
                        metamaskWallet({ recommended: true }),
                        coinbaseWallet({ recommended: true }),
                        walletConnect(),
                        embeddedWallet({
                            auth: {
                                options: [
                                    "google",
                                    "apple",
                                    "facebook",
                                    "email",
                                ],
                            },
                        }),
                        zerionWallet(),
                        rainbowWallet(),
                        phantomWallet(),
                    ]}
                >
                    <nav>
                        <Navbar />
                    </nav>
                    {children}
                </ThirdwebProvider>
            </body>
            <Toaster />
        </html>
    )
}
