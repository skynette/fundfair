'use client';

import { nanoid } from "nanoid";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { optToUSD } from "@/lib/api/util/endpoint";
import { useState } from "react";
import { Label } from "../ui/label";
import { useAddress } from "@thirdweb-dev/react";
import { toast } from "sonner";

const RightPane = () => {
    const amounts = [5, 10, 25, 50, 75, 100];
    const address = useAddress();
    const [opAmount, setOpAmount] = useState<string>();
    const [usdAmount, setUsdAmount] = useState<string>();

    const { data, isPending } = useQuery({
        queryKey: ['optimism-price'],
        queryFn: optToUSD
    });

    const handleUsdToOp = (amount: number) => {
        const optValue = amount / (data?.optimism.usd ?? 1);
        setUsdAmount(amount.toString());
        setOpAmount(optValue.toFixed(4));
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

            <Label htmlFor='opt' className='text-gray-500 text-sm mt-4'>Optimism</Label>
            <Input disabled={true} id='opt' value={opAmount} placeholder="Optimism" className="mt-[2px] focus-visible:ring-0 focus-visible:ring-offset-0" />

            <Button disabled={isPending} className='mt-6 inline-flex justify-between text-white bg-purple-500 text-sm font-semibold'
                onClick={() => {
                    !useAddress && toast.error('No wallet has been connected');
                }}>
                Donate now
                <ArrowUpRight size={32} />
            </Button>
        </div>
    )
}

export default RightPane;