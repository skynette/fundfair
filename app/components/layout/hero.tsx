'use client';

import Link from "next/link";
import { Button } from "../ui/button";

const Hero = () => {
    return (
        <div className="container flex flex-col pt-12 pb-6 items-center">
            <div className="bg-purple-100 py-1 px-4 rounded-2xl">
                <p className="font-medium text-sm text-purple-600">Small effort, Make big change</p>
            </div>

            <h1 className="text-3xl mt-6 text-center font-bold lg:leading-[60px] lg:text-5xl lg:max-w-[65%]">
                Empower Change with Every Donation
            </h1>

            <p className="text-center mt-3 text-gray-600 font-medium lg:max-w-[55%]">
                Boost your nonprofits reach with our suite of fundraising tools. Craft compelling campaigns, engage and track all in one place.
            </p>

            <Link href='/auth/signup' legacyBehavior passHref>
                <Button variant='default' className="capitalize mt-4 px-6 bg-purple-600 rounded-xl text-white font-semibold hover:bg-purple-200 hover:text-purple-600">
                    get started now
                </Button>
            </Link>
        </div>
    )
}

export default Hero;