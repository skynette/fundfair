'use client';

import { Button } from "../ui/button";

const Hero = () => {
    return (
        <div className="container flex flex-col pt-12 pb-6 items-center">
            <div className="bg-purple-100 py-1 px-4 rounded-2xl">
                <p className="font-medium text-sm text-purple-600">Small effort, Make big change</p>
            </div>

            <h1 className="max-w-[65%] text-5xl mt-6 text-center font-bold leading-[60px]">
                Empower Change with Every Donation
            </h1>

            <p className="max-w-[55%] text-center mt-3 text-gray-600 font-medium">
                Boost your nonprofits reach with our suite of fundraising tools. Craft compelling campaigns, engage and track all in one place.
            </p>

            <Button variant='default' className="mt-4 px-6 bg-purple-600 rounded-xl text-white font-semibold hover:bg-purple-200 hover:text-purple-600">
                Contribute Now
            </Button>
        </div>
    )
}

export default Hero;