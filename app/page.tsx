'use client'

import {
    ThirdwebProvider,
    ConnectWallet,
    metamaskWallet,
    coinbaseWallet,
    walletConnect,
    embeddedWallet,
    zerionWallet,
    rainbowWallet,
    phantomWallet,
    en,
} from "@thirdweb-dev/react";

export default function Home() {
    return (
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
            <ConnectWallet
                theme={"dark"}
                auth={{ loginOptional: false }}
                switchToActiveChain={true}
                modalSize={"wide"}
                className="w-full h-full bg-gray-900 text-white"
            />
        </ThirdwebProvider>
    );
}