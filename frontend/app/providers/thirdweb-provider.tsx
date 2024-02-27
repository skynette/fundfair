'use client'
import { ThirdwebProvider } from "@thirdweb-dev/react";

interface ThirdWebProviderProps {
    children: React.ReactNode
}
const ThirdWebProvider: React.FC<ThirdWebProviderProps> = ({ children }) => {
    return (
        <ThirdwebProvider activeChain={'mumbai'} clientId={process.env.NEXT_THIRDWEB_CLIENT_ID}>
            {children}
        </ThirdwebProvider>

    )
}

export default ThirdWebProvider