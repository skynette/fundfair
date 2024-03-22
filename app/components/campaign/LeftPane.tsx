'use client';

import { ArrowsClockwise, CalendarX, HourglassMedium, PiggyBank, ShareNetwork, Target, UsersThree } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getCampaign } from "@/lib/api/campaign/endpoint";
import SpinLoader from "../ui/loader";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { Progress } from "../ui/progress";
import { formatNumber } from "@/lib/utils";
import Empty from "../ui/empty";

const CampaignInfo = ({ icon, title, value }: { icon?: React.ReactNode, title?: string, value?: string }) => {
    return (
        <div className="flex flex-col items-center text-gray-500">
            {icon}
            <p className="font-normal text-sm">{title}</p>
            <p className="font-medium text-black text-center">{value}</p>
        </div>
    )
}

const CampaignDesc = ({ text }: { text?: string }) => {
    return (
        <div>
            <p>
                {text}
            </p>
        </div>
    );
}

const FundItem = ({ donation, donator }: { donation: string, donator: string }) => {
    return (
        <div className="flex justify-between p-3 rounded-lg border border-gray-300/50">
            <div className="flex flex-col">
                <p className="font-semibold text-sm">{`${donator.substring(0, 6)}...${donator.substring(donator.length - 4)}`}</p>
                <p className="text-xs text-gray-500">Mar 23, 2023</p>
            </div>
            <p className="font-semibold text-sm">{`$${donation}`}</p>
        </div>
    );
}

const FundingList = ({ donations, donators }: { donations: number[], donators: string[] }) => {
    if (donations.length === 0 || donators.length === 0) return <Empty />;

    return (
        <div className="flex flex-col space-y-3 lg:w-[70%]">
            {
                donations.map((_, index) => <FundItem key={nanoid()} donation={donations[index].toString()} donator={donators[index]} />)
            }
        </div>
    )
}

const LeftPane = () => {
    const param = useParams();
    const id = param.id;

    const [tab, setTab] = useState(0);
    const { data: campaign, isSuccess, isError, isFetching } = useQuery({
        queryKey: ['campaign', id],
        queryFn: () => getCampaign(id)
    });

    if (isFetching) return <SpinLoader />;

    if (isError)
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p>Something went wrong :(</p>
            </div>
        );

    return (
        <div className="flex flex-col">
            <h1 className="font-semibold text-lg">Overview</h1>
            <AspectRatio ratio={10 / 7}>
                <Image src={campaign?.image ?? ''}
                    alt=""
                    fill
                    className="rounded-md object-cover mt-2" />
            </AspectRatio>

            <p className="capitalize mt-2 font-semibold text-xl lg:mt-4 lg:text-3xl">
                {campaign?.title}
            </p>

            <Progress value={((campaign?.amountRaisedUSD ?? 1) / (campaign?.targetInUsd ?? 1)) * 100} max={100} />

            <div className="p-2 my-2 rounded-lg bg-gray-50 gap-y-3 grid grid-cols-3 lg:grid-cols-5 lg:gap-y-0 lg:my-4">
                <CampaignInfo icon={<Target size={24} />} title='Target($)' value={formatNumber(campaign?.targetInUsd.toFixed(2))} />
                <CampaignInfo icon={<HourglassMedium size={24} />} title='Left($)' value={formatNumber(((campaign?.targetInUsd ?? 0) - (campaign?.amountRaisedUSD ?? 0)).toFixed(2))} />
                <CampaignInfo icon={<PiggyBank size={24} />} title='Raised($)' value={formatNumber(campaign?.amountRaisedUSD.toFixed(2))} />
                <CampaignInfo icon={<CalendarX size={24} />} title='Target deadline' value={'24th March 2023'} />
                <CampaignInfo icon={<UsersThree size={24} />} title='Donors' value={campaign?.donators.length.toString()} />
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
                    tab === 0 ? <CampaignDesc text={campaign?.description} /> : <FundingList donations={campaign?.donationsUSD ?? []} donators={campaign?.donators ?? []} />
                }
            </div>

        </div>
    );
}

export default LeftPane;