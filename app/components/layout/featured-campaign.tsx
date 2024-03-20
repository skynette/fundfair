'use client';

import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { FolderSimple } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { nanoid } from 'nanoid';
import { Button } from "../ui/button";

import { useContract, useContractRead } from "@thirdweb-dev/react";
import { Campaign, BigNumber, FundingModel, CauseCategory } from "../../lib/types";
import { causeCategoryOption, convertToCampaigns } from "@/lib/utils";
import Link from "next/link";

export const CampaignItem = (campaign: Campaign) => {
    console.log(campaign);
    return (
        <div className="flex flex-col shadow-sm justify-end rounded-lg bg-gray-600/0.5">
            {/* <AspectRatio ratio={10 / 7}>
                <Image src={campaign.image}
                    alt=""
                    fill
                    className="rounded-md object-cover" />
            </AspectRatio> */}

            <div className="flex flex-col p-2">
                <div className="flex items-start py-2 space-x-2 text-gray-500">
                    <FolderSimple size={24} />
                    <p className="text-sm translate-y-1">{causeCategoryOption[campaign.category].option}</p>
                </div>

                <p className="font-semibold leading-5 text-black md:leading-normal">{campaign.title}</p>
                <p className="text-sm text-gray-500 line-clamp-3">{campaign.description}</p>

                <div className="grid grid-cols-3 my-2">
                    <div className="flex flex-col">
                        <p className="text-sm font-medium lg:font-semibold lg:text-base">$2000</p>
                        <p className="text-gray-500 text-sm">Target</p>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-sm font-medium lg:font-semibold lg:text-base">$500</p>
                        <p className="text-gray-500 text-sm">Raised</p>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-sm font-medium lg:font-semibold lg:text-base">150</p>
                        <p className="text-gray-500 text-sm">Backers</p>
                    </div>
                </div>

                <Link href={`/campaign/${campaign.owner}`} legacyBehavior passHref>
                    <Button className='w-fit' size='sm'>
                        Donate
                    </Button>
                </Link>

                {/* <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>FF</AvatarFallback>
                    </Avatar>

                    <p className="text-black font-semibold text-sm"><span className="text-gray-500 text-sm">by </span>Town Hall</p>
                </div> */}
            </div>
        </div>
    )
}

const FeaturedCampaign = () => {
    const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    const { data: allCampaigns, isSuccess, isLoading } = useContractRead(contract, "getCampaigns");

    return (
        <div className="container flex flex-col space-y-2 py-6 lg:py-12">
            <p className="text-center text-xl font-semibold">Featured campaigns</p>
            <div className="w-full grid gap-2 grid-cols-1 md:gap-3 md:grid-cols-3 lg:gap-4 lg:grid-cols-4">
                {
                    isSuccess && convertToCampaigns(allCampaigns).map(campaign => (<CampaignItem key={nanoid()} {...campaign} />))
                }
            </div>
        </div>
    )
}

export default FeaturedCampaign;