'use client';

import SigninForm from '@/components/form/SigninForm';
import SignupForm from '@/components/form/SignupForm';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

function Auth() {
    const router = useRouter();
    const authPage = useParams().auth;
    const [page] = useState(authPage === 'signin' ? 0 : 1);

    return (
        <div className='container flex justify-center items-center py-12'>
            <div className='w-full flex flex-col border border-gray-200 rounded-md shadow-md lg:w-[30%]'>
                <div className='flex justify-between'>
                    <Button variant='ghost' className={`${page === 0 ? 'border-b-[2.5px] border-b-primary text-black w-full p-6' : 'w-full border-b-[1px] border-b-gray-200 text-gray-600'} p-6 rounded-none`}
                        onClick={() => router.replace('/auth/signin')}>
                        <p className='font-semibold'>Sign In</p>
                    </Button>
                    <Button variant='ghost' className={`${page === 1 ? 'border-b-[2.5px] border-b-primary text-black w-full p-6' : 'w-full border-b-[1px] border-b-gray-200 text-gray-600'} p-6 rounded-none`}
                        onClick={() => router.replace('/auth/signup')}>
                        <p className='font-semibold'>Sign Up</p>
                    </Button>
                </div>
                {
                    page === 0 ? <SigninForm /> : <SignupForm />
                }
            </div>
        </div>
    )
}

export default Auth;