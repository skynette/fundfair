'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "@phosphor-icons/react";

const EmailVerification = () => {
    return (
        <div className="container mx-auto">
            <div className="flex min-h-screen mt-8 items-start justify-center lg:mt-0 lg:items-center">
                <div className="flex flex-col space-y-4 p-4 rounded-md shadow-md lg:p-8">
                    <p className="capitalize text-center text-xl font-semibold">verify your email address</p>
                    <p className="text-gray-600 text-sm text-center">Enter the verification code sent to your email address</p>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="otp-input">Verification Code</Label>
                        <Input id="otp-input" />
                    </div>
                    <Button className="text-white uppercase tracking-wider">
                        verify me <ArrowRight size={20} className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default EmailVerification;