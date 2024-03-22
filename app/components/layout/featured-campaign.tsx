'use client';

import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { FolderSimple } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { nanoid } from 'nanoid';
import { Button } from "../ui/button";

import { useContract, useContractRead } from "@thirdweb-dev/react";
import { BigNumber, FundingModel, CauseCategory } from "../../lib/types";
import { causeCategoryOption, convertToCampaigns, formatNumber } from "@/lib/utils";
import Link from "next/link";
import SpinLoader from "../ui/loader";
import Empty from "../ui/empty";
import { useQuery } from "@tanstack/react-query";
import { getAllCampaigns } from "@/lib/api/campaign/endpoint";
import { Campaign } from "@/lib/network/campaign/CampaignResponse";

export const CampaignItem = (campaign: Campaign) => {
    return (
        <div className="flex flex-col shadow-sm justify-end rounded-lg bg-gray-600/0.5">
            <AspectRatio ratio={10 / 7}>
                <Image src={campaign.image}
                    alt=""
                    fill
                    className="rounded-md object-cover" />
            </AspectRatio>

            <div className="flex flex-col p-2">
                <div className="flex items-start py-2 space-x-2 text-gray-500">
                    <FolderSimple size={24} />
                    <p className="text-sm translate-y-1">{causeCategoryOption[campaign.category].option}</p>
                </div>

                <p className="font-semibold leading-5 text-black md:leading-normal">{campaign.title}</p>
                <p className="text-sm text-gray-500 line-clamp-3">{campaign.description}</p>

                <div className="grid grid-cols-3 my-2">
                    <div className="flex flex-col">
                        <p className="text-sm font-medium">{formatNumber(campaign.target.toFixed(2))}</p>
                        <p className="text-gray-500 text-sm">Target (USD)</p>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-sm font-medium">{formatNumber(campaign.amountRaisedUSD.toFixed(2))}</p>
                        <p className="text-gray-500 text-sm">Raised (USD)</p>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-sm font-medium">{campaign.donators.length}</p>
                        <p className="text-gray-500 text-sm">Donators</p>
                    </div>
                </div>

                <Link href={`/campaign/${campaign.index}`} legacyBehavior passHref>
                    <Button className='w-fit' size='sm'>
                        Donate
                    </Button>
                </Link>
            </div>
        </div>
    )
}

const FeaturedCampaign = () => {
    const { data: allCampaigns, isSuccess, isLoading, isError } = useQuery({
        queryKey: ['all-campaigns'],
        queryFn: getAllCampaigns
    });

    if (isLoading && !isError) {
        return <SpinLoader message='Fetching featured campaigns' />;
    }

    if (isSuccess && !isLoading && allCampaigns?.success?.length === 0)
        return <Empty />;

    console.log(allCampaigns);

    return (
        <div className="container flex flex-col space-y-2 py-6 lg:py-12">
            <p className="text-center text-xl font-semibold">Featured campaigns</p>
            <div className="w-full grid gap-2 grid-cols-1 md:gap-3 md:grid-cols-3 lg:gap-4 lg:grid-cols-4">
                {
                    isSuccess && allCampaigns?.success?.map((campaign, index) => {
                        if (index > 7) return;
                        return <CampaignItem key={nanoid()} {...campaign} />
                    })
                }
            </div>
        </div>
    )
}

export default FeaturedCampaign;