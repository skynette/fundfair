import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { ArrowRight } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import FormikControl from '../form-controls/FormikControl';
import { useMutation } from '@tanstack/react-query';
import SigninRequest from '@/lib/network/auth/SigninRequest';
import AuthResponse from '@/lib/network/auth/AuthResponse';
import { AxiosError } from 'axios';
import { signin } from '@/lib/api/auth/endpoint';
import useAuth from '@/lib/hooks/useAuth';

interface SigninField {
    username: string;
    password: string;
}

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters')
})

function SigninForm() {
    const router = useRouter();
    const { setAuth } = useAuth();
    const { mutate, isPending } = useMutation<AuthResponse, AxiosError, SigninRequest>({
        mutationFn: (request: SigninRequest) => signin(request),
        onSuccess(data, variables, context) {
            toast.success('Login successful!');
            setAuth(data);
            router.push('/');
        },
        onError(error, variables, context) {
            console.log(error.response);
            // @ts-ignore
            toast.error(error.response?.data);
        },
    });

    const initialValues: SigninField = {
        username: '',
        password: ''
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(field) => {
                mutate({
                    username: field.username,
                    password: field.password
                });
            }}>
            {
                () => (
                    <Form className='px-4 py-8'>
                        <div className='flex flex-col space-y-3'>
                            <FormikControl
                                label='Username'
                                name='username'
                                type='text'
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

                        <Button
                            isLoading={isPending}
                            disabled={isPending}
                            type='submit' className='mt-6 uppercase w-full font-bold py-6'>sign in <ArrowRight className='ml-2' weight='bold' size={20} /></Button>
                    </Form>
                )
            }
        </Formik>
    )
}

export default SigninForm;