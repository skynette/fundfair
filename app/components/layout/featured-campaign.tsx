'use client';

import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { FolderSimple } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { nanoid } from 'nanoid';
import { Button } from "../ui/button";

import { useContract, useContractRead } from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import { Campaign, BigNumber, FundingModel, CauseCategory } from "../../lib/types";
import { convertToCampaigns } from "@/lib/utils";

export const CampaignItem = (campaign: Campaign) => {
    console.log(campaign);
    return (
        <div className="flex flex-col shadow-sm rounded-lg bg-gray-600/0.5">
            <AspectRatio ratio={10 / 7}>
                <Image src='https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80'
                    alt=""
                    fill
                    className="rounded-md object-cover" />
            </AspectRatio>

            <div className="flex flex-col p-2">
                <div className="flex items-start py-2 space-x-2 text-gray-500">
                    <FolderSimple size={24} />
                    <p className="text-sm translate-y-1">Education</p>
                </div>

                <p className="font-semibold text-base leading-5 text-black md:leading-normal lg:text-lg">Powered Kits Learning Boxes</p>
                <p className="text-sm text-gray-500">Together we can create access for everyone!</p>

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

                <Button className='w-fit' size='sm'>
                    Donate
                </Button>

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