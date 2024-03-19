'use client';

import { CampaignItem } from "@/components/layout/featured-campaign";
import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

const CampaignPage = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col space-y-2 py-4 lg:py-8 lg:px-4 lg:space-y-5">
            <div className="flex my-2 justify-between">
                <p className="text-lg font-semibold">Campaigns</p>
                <Button className="text-white" onClick={() => {
                    router.push('/dashboard/campaign/create');
                }}>
                    <Plus size={24} className="mr-2" /> Create campaign
                </Button>
            </div>
            {/* <div className=" grid gap-2 grid-cols-2 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-6">
                {
                    Array.from({ length: 6 }).map(item => <CampaignItem key={nanoid()} />)
                }
            </div> */}
        </div>
    )
}

export default CampaignPage;