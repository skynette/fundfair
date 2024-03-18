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

// import chains from thirdweb
import { OpSepoliaTestnet } from "@thirdweb-dev/chains";
import Providers from './providers/react-query-provider';


const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'fallback',
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={cn('', epilogue.className)}>
            <body className=''>
                <Providers>
                    <ThirdwebProvider
                        activeChain={OpSepoliaTestnet}
                        clientId={process.env.NEXT_THIRDWEB_CLIENT_ID}
                        locale={en()}
                        supportedWallets={[
                            metamaskWallet({ recommended: true }),
                            coinbaseWallet({ recommended: true }),
                            walletConnect(),
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
                </Providers>
            </body>
        </html>
    )
}
