'use client';

import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import SideBar from "../dashboard/SideBar";
import useAuth from "@/lib/hooks/useAuth";
import { userLoggedIn } from "@/lib/utils";
import { SquaresFour, User } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const Navbar = () => {
    const { auth } = useAuth();
    const [client, setClient] = useState(false);

    const address = useAddress();
    const disconnect = useDisconnect();

    useEffect(() => {
        setClient(true);
    }, [client]);

    return (
        <div className="shadow-md">
            <div className="container flex justify-between items-center py-4">
                <div className="flex items-center space-x-1 lg:space-x-0">
                    <Sheet>
                        <SheetTrigger className="flex lg:hidden" asChild>
                            <Button variant='ghost' size='icon' className="flex lg:hidden">
                                <Menu size={24} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="px-0 py-6 overflow-y-scroll no-scrollbar">
                            <SideBar />
                        </SheetContent>
                    </Sheet>
                    <Link href='/' className="translate-y-[2px]">
                        <p className='font-semibold tracking-wider uppercase'>FundFair</p>
                    </Link>
                </div>

                {
                    (userLoggedIn(auth) && client) ?
                        <div className="flex items-center space-x-1">
                            <Link href='/dashboard/profile' passHref legacyBehavior>
                                <Button className="hidden lg:flex" variant='ghost' size='icon'>
                                    <User size={28} />
                                </Button>
                            </Link>

                            <Link href='/dashboard/campaign' passHref legacyBehavior>
                                <Button className="hidden lg:flex" variant='ghost' size='icon'>
                                    <SquaresFour size={28} />
                                </Button>
                            </Link>

                            {!address &&
                                <ConnectWallet
                                    theme={"dark"}
                                    auth={{ loginOptional: false }}
                                    switchToActiveChain={true}
                                    modalSize={"wide"}
                                    className="-translate-x-[50%] -translate-y-[50%] bg-gray-900 text-white"
                                />
                            }
                            {address && (
                                <div className="flex items-center justify-center gap-2 bg-gray-900 text-white p-3 rounded-lg">
                                    <span>{`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}</span>
                                    <button
                                        onClick={disconnect}
                                        className="p-2 rounded-full bg-red-500 hover:bg-red-700 transition-colors"
                                        aria-label="Disconnect">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9M12 15.75v-6.75m0 0L8.25 12m3.75-3.75L15.75 12M21 12H3" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        :
                        <div className="flex space-x-1 justify-between lg:space-x-2">
                            <Link href='/auth/signin' legacyBehavior passHref>
                                <Button variant='ghost'>Signin</Button>
                            </Link>
                            <Link href='/auth/signup' legacyBehavior passHref>
                                <Button variant='outline' className="py-1 px-3">Get Started</Button>
                            </Link>
                        </div>
                }
            </div>
        </div>
    )
}

export default Navbar;