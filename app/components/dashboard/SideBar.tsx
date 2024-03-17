'use client';

import { House, Megaphone, User } from '@phosphor-icons/react';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function SideLink({ icon, label, route, isCurrent }: { icon: React.ReactNode, label: string, route: string, isCurrent: boolean }) {
    return (
        <Link href={route} legacyBehavior passHref>
            <a href={route}>
                <div className={`${isCurrent ? 'bg-blue-500/90 text-white rounded-lg' : ''} flex p-2 space-x-3 text-gray-600 items-center cursor-pointer hover:rounded-lg hover:text-white hover:bg-gray-500`}>
                    {icon}
                    <p className=''>{label}</p>
                </div>
            </a>
        </Link>
    )
}

const sidebarLinks = [
    {
        icon: <Megaphone size={32} />,
        label: 'Campaign',
        route: '/dashboard/campaign'
    },
    {
        icon: <User size={32} />,
        label: 'Profile',
        route: '/dashboard/profile'
    },
]

function SideBar() {
    const pathname = usePathname();

    return (
        <div className='flex flex-col px-4 py-8 lg:px-0'>
            <p className='font-medium ml-2 text-lg text-black mb-2.5 lg:mb-5 lg:text-xl'>Dashboard</p>

            <div className='flex flex-col lg:space-y-2'>
                {
                    sidebarLinks.map(link => (
                        <SideLink key={nanoid()} icon={link.icon} label={link.label}
                            route={link.route}
                            isCurrent={pathname.includes(link.label.toLowerCase())} />
                    ))
                }
                <SideLink icon={<House size={32} />} label='Home' route='/' isCurrent={false} />
            </div>
        </div>
    )
}

export default SideBar;