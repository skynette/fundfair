'use client';

import { ConnectWallet } from "@thirdweb-dev/react";
import { Button } from "../ui/button";

const Navbar = () => {
    return (
        <div className="shadow-md">
            <div className="container flex justify-between items-center py-4">
                <p className='font-semibold tracking-wider uppercase'>FundFair</p>

                <div>
                    <Button variant='ghost'>Signin</Button>
                    <Button variant='outline' className="py-1 px-3">Get Started</Button>
                </div>

                <ConnectWallet
                    theme={"dark"}
                    auth={{ loginOptional: false }}
                    switchToActiveChain={true}
                    modalSize={"wide"}
                    className="mx-auto -translate-x-[50%] -translate-y-[50%] bg-gray-900 text-white"
                />
            </div>
        </div>
    )
}

export default Navbar;