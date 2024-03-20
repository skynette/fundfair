'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyEmail } from "@/lib/api/auth/endpoint";
import { VerifyResponse } from "@/lib/network/auth/VerifyResponse";
import { ArrowRight } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EmailVerification = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [otp, setOtp] = useState('');

    const { data, isFetching, isSuccess, isError, error, refetch } = useQuery<VerifyResponse, AxiosError>({
        queryKey: ['verify'],
        queryFn: () => verifyEmail(otp, email?.toString() ?? ''),
        enabled: false,
    });

    useEffect(() => {
        if (isSuccess) {
            toast.success('Email verified successfully')
            router.replace('/auth/login');
        }
    }, [data, isSuccess, router]);

    useEffect(() => {
        if (isError && !isFetching) {
            if (error.response?.status === 400)
                toast.error('Invalid or expired OTP.');
        }
    }, [error, isError, isFetching]);

    return (
        <div className="container mx-auto">
            <div className="flex min-h-screen mt-8 items-start justify-center lg:mt-0 lg:items-center">
                <div className="flex flex-col space-y-4 p-4 rounded-md shadow-md lg:p-8">
                    <p className="capitalize text-center text-xl font-semibold">verify your email address</p>
                    <p className="text-gray-600 text-sm text-center">Enter the verification code sent to your email address</p>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="otp-input">Verification Code</Label>
                        <Input id="otp-input" value={otp} onChange={(e) => setOtp(e.currentTarget.value)} />
                    </div>
                    <Button disabled={isFetching} isLoading={isFetching}
                        onClick={() => refetch()}
                        className="text-white uppercase tracking-wider">
                        verify me <ArrowRight size={20} className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default EmailVerification;