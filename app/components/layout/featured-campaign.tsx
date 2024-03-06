import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { FolderSimple } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { nanoid } from 'nanoid';

const Campaign = () => {
    return (
        <div className="flex flex-col w-[450px] shadow-sm bg-gray-50">
            <AspectRatio ratio={10 / 7}>
                <Image src='https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80'
                    alt=""
                    fill
                    className="rounded-md object-cover" />
            </AspectRatio>

            <div className="flex flex-col p-2">
                <div className="flex items-center py-2 text-gray-500 space-x-2">
                    <FolderSimple size={24} />
                    <p className="text-sm">Education</p>
                </div>

                <p className="font-semibold text-lg text-black">Powered Kits Learning Boxes</p>
                <p className="text-sm text-gray-500">Together we can create access for everyone!</p>

                <div className="flex justify-between my-2">
                    <div className="flex flex-col">
                        <p className="font-semibold">$2000</p>
                        <p className="text-gray-500 text-sm">Target</p>
                    </div>

                    <div className="flex flex-col">
                        <p className="font-semibold">$500</p>
                        <p className="text-gray-500 text-sm">Raised</p>
                    </div>

                    <div className="flex flex-col">
                        <p className="font-semibold">150</p>
                        <p className="text-gray-500 text-sm">Backers</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>FF</AvatarFallback>
                    </Avatar>

                    <p className="text-black font-semibold text-sm"><span className="text-gray-500 text-sm">by </span>Town Hall</p>
                </div>
            </div>
        </div>
    )
}

const FeaturedCampaign = () => {
    return (
        <div className="container flex flex-col space-y-2 py-12">
            <p className="text-center text-xl font-semibold">Featured campaigns</p>
            <div className="w-full flex justify-between space-x-4">
                {
                    Array.from({ length: 4 }).map(item => <Campaign key={nanoid()} />)
                }
            </div>
        </div>
    )
}

export default FeaturedCampaign;