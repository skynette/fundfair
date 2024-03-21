'use client';

import { nanoid } from "nanoid";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { ethToUSD } from "@/lib/api/util/endpoint";
import { useState } from "react";
import { Label } from "../ui/label";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const RightPane = () => {
    const amounts = [5, 10, 25, 50, 75, 100];
    const address = useAddress();
    const [ethAmount, setEthAmount] = useState<string>();
    const [usdAmount, setUsdAmount] = useState<string>();

    const params = useParams();
    
    const { data, isPending } = useQuery({
        queryKey: ['optimism-price'],
        queryFn: ethToUSD
    });

    const handleUsdToOp = (amount: number) => {
        const optValue = amount / (data?.ethereum.usd ?? 1);
        setUsdAmount(amount.toString());
        setEthAmount(optValue.toFixed(4));
    }

    const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

    const { mutateAsync: fundCampaign, isLoading } = useContractWrite(contract, "fundCampaign")

    const donateToCampaign = async () => {
        const formattedAmount = parseFloat(ethAmount as string) * 10 ** 18;
        try {
            const data = await fundCampaign({
                args: [params.id],
                overrides: {
                    value: formattedAmount.toString()
                }
            });
            console.info("contract call successs", data);
        } catch (err) {
            console.error("contract call failure", err);
        }
    }

    return (
        <div className="flex flex-col border rounded-lg p-4 lg:border-none lg:p-0">
            <p className="uppercase text-4xl font-black">donate now!</p>
            <div className="mt-4 grid gap-3 grid-cols-3">
                {
                    amounts.map(amount => (
                        <Button key={nanoid()} className='text-purple-500 font-medium rounded-md' variant='outline'
                            onClick={() => handleUsdToOp(amount)}>{`$${amount}`}</Button>
                    ))
                }
            </div>

            <Label htmlFor='donate-input' className='text-gray-500 text-sm mt-4'>USD</Label>
            <Input id='donate-input' value={usdAmount} onChange={(e) => {
                setUsdAmount(e.currentTarget.value);
                handleUsdToOp(+e.currentTarget.value);
            }} placeholder="USD" className="mt-[2px] focus-visible:ring-0 focus-visible:ring-offset-0" />

            <Label htmlFor='opt' className='text-gray-500 text-sm mt-4'>Ethereum</Label>
            <Input disabled={true} id='opt' value={ethAmount} placeholder="ETH" className="mt-[2px] focus-visible:ring-0 focus-visible:ring-offset-0" />

            <Button disabled={isPending || isLoading} className='mt-6 inline-flex justify-between text-white bg-purple-500 text-sm font-semibold'
                onClick={() => {
                    !address && toast.error('No wallet has been connected');
                    address && donateToCampaign();
                }}>
                Donate now
                <ArrowUpRight size={32} />
            </Button>
        </div>
    )
}

export default RightPane;