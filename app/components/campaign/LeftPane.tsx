'use client';

import { ArrowsClockwise, CalendarX, HourglassMedium, PiggyBank, ShareNetwork, Target, UsersThree } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { nanoid } from "nanoid";

const CampaignInfo = ({ icon, title, value }: { icon?: React.ReactNode, title: string, value: string }) => {
    return (
        <div className="flex flex-col items-center text-gray-500">
            {icon}
            <p className="font-normal text-sm">{title}</p>
            <p className="font-medium text-black text-center">{value}</p>
        </div>
    )
}

const CampaignDesc = ({ text }: { text: string }) => {
    return (
        <div>
            <p>
                {text}
            </p>
        </div>
    );
}

const FundItem = () => {
    return (
        <div className="flex justify-between p-3 rounded-lg border border-gray-300/50">
            <div className="flex flex-col">
                <p className="font-semibold text-sm">Town Hall</p>
                <p className="text-xs text-gray-500">Mar 23, 2023</p>
            </div>
            <p className="font-semibold text-sm">$20</p>
        </div>
    );
}

const FundingList = () => {
    return (
        <div className="flex flex-col space-y-3 lg:w-[70%]">
            {
                Array.from({ length: 4 }).map(_ => <FundItem key={nanoid()} />)
            }
        </div>
    )
}

const LeftPane = () => {
    const [tab, setTab] = useState(0);
    return (
        <div className="flex flex-col">
            <h1 className="font-semibold text-lg">Overview</h1>
            <p className="capitalize mt-2 font-semibold text-xl lg:mt-4 lg:text-3xl">
                give clean water to developing community
            </p>

            <div className="p-2 my-2 rounded-lg bg-gray-50 gap-y-3 grid grid-cols-3 lg:grid-cols-5 lg:gap-y-0 lg:my-4">
                <CampaignInfo icon={<Target size={24} />} title='Target' value="$5000" />
                <CampaignInfo icon={<HourglassMedium size={24} />} title='Left' value="$1500" />
                <CampaignInfo icon={<PiggyBank size={24} />} title='Raised' value="$3500" />
                <CampaignInfo icon={<CalendarX size={24} />} title='Target deadline' value="23rd, June 2024" />
                <CampaignInfo icon={<UsersThree size={24} />} title='Donors' value="42" />
            </div>

            <Button variant='outline' className="w-fit">
                <ShareNetwork size={24} />
            </Button>

            <Separator className="my-4" />

            <div className="w-fit flex">
                <div className='w-fit flex items-start justify-start rounded-md border border-gray-300'>
                    <Button variant='ghost' className={`${tab === 0 ? 'text-black font-medium' : 'text-gray-500 font-normal'} rounded-none`}
                        onClick={() => setTab(0)}>Description</Button>
                    <Separator orientation='vertical' />
                    <Button variant='ghost' className={`${tab === 1 ? 'text-black font-medium' : 'text-gray-500 font-normal'} rounded-none`}
                        onClick={() => setTab(1)}>Funds update</Button>
                </div>
                {tab === 1 &&
                    <Button variant='ghost' size='icon' className='ml-2'>
                        <ArrowsClockwise size={24} />
                    </Button>
                }
            </div>

            <div className="mt-2">
                {
                    tab === 0 ? <CampaignDesc text={`
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    `} /> : <FundingList />
                }
            </div>

        </div>
    )
}

export default LeftPane;