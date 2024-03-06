import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { ArrowRight, GoogleLogo } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import FormikControl from '../form-controls/FormikControl';

interface SigninField {
    email: string;
    password: string;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Provide a valid email address'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters')
})

function SigninForm() {
    const router = useRouter();
    // const { setAccessToken, setAuth } = useAuth();
    // const { mutate, data, isPending, isSuccess } = useLogin();

    const initialValues: SigninField = {
        email: '',
        password: ''
    }

    // if (isSuccess) {
    //     toast.success('Login successful!');
    //     setAccessToken(data?.accessToken ?? '');
    //     setAuth({
    //         id: data?._id ?? '',
    //         fullname: data?.fullname ?? '',
    //         email: data?.email ?? '',
    //         displayName: data?.displayName ?? '',
    //         roles: data?.roles ?? '',
    //     });
    //     router.push('/');
    // }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(field) => {
            }}>
            {
                () => (
                    <Form className='p-8'>
                        <div className='flex flex-col space-y-3'>
                            <FormikControl
                                label='Email Address'
                                name='email'
                                type='email'
                                control='input'
                            />

                            <FormikControl
                                label='Password'
                                name='password'
                                type='password'
                                control='input'
                            />
                            <Button variant='link' className='p-0 -translate-y-4 text-xs text-blue-500 self-end'>Forget password?</Button>
                        </div>

                        <Button type='submit' className='mt-6 uppercase w-full font-bold py-6'>sign in <ArrowRight className='ml-2' weight='bold' size={20} /></Button>

                        <div className='relative w-full max-w-full mt-4 flex items-center justify-between'>
                            <Separator className='w-[40%]' />
                            <p className='text-gray-600'>or</p>
                            <Separator className='w-[40%]' />
                        </div>

                        <Button variant='outline' className='w-full rounded-md mt-4'>
                            <GoogleLogo weight='bold' size={24} className='mr-3' />
                            Sign in with Google
                        </Button>
                    </Form>
                )
            }
        </Formik>
    )
}

export default SigninForm;