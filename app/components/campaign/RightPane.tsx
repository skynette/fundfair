'use client';

import { nanoid } from "nanoid";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { optToUSD } from "@/lib/api/util/endpoint";
import { useState } from "react";
import { Label } from "../ui/label";

const RightPane = () => {
    const amounts = [5, 10, 25, 50, 75, 100];
    const [amountToDonate, setAmountToDonate] = useState<number>();

    const { data } = useQuery({
        queryKey: ['optimism-price'],
        queryFn: optToUSD
    });

    return (
        <div className="flex flex-col border rounded-lg p-4 lg:border-none lg:p-0">
            <p className="uppercase text-4xl font-black">donate now!</p>
            <div className="mt-4 grid gap-3 grid-cols-3">
                {
                    amounts.map(amount => (
                        <Button key={nanoid()} className='text-blue-500 font-medium rounded-md' variant='outline'
                            onClick={() => {
                                const optValue = amount / (data?.optimism.usd ?? 1);
                                setAmountToDonate(+optValue.toFixed(4));
                            }}>{`$${amount}`}</Button>
                    ))
                }
            </div>

            <Label htmlFor='donate-input' className='text-gray-500 text-sm mt-4'>Optimism</Label>
            <Input id='donate-input' value={amountToDonate} placeholder="Optimism" className="mt-[2px] focus-visible:ring-0 focus-visible:ring-offset-0" />

            <Button className='mt-6 inline-flex justify-between text-white bg-blue-500 text-sm font-semibold'>
                Donate now
                <ArrowUpRight size={32} />
            </Button>
        </div>
    )
}

export default RightPane;