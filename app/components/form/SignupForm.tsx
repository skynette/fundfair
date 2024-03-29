import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { ArrowRight } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import FormikControl from '../form-controls/FormikControl';
import { useMutation } from '@tanstack/react-query';
import SignupRequest from '@/lib/network/auth/SignupRequest';
import { signup } from '@/lib/api/auth/endpoint';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import AuthResponse from '@/lib/network/auth/AuthResponse';

interface SignupField {
    fullname: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const validationSchema = Yup.object().shape({
    fullname: Yup.string().required('Fullname is required').trim()
        .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)+$/, 'Invalid full name format. Please enter first name and last name.'),
    username: Yup.string().required('User name is required').trim(),
    email: Yup.string().required('Email is required').email('Provide a valid email address'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password'), ''], 'Passwords must match')
})

function SignupForm() {
    const router = useRouter();
    const { data, isPending, isSuccess, isError, error, mutate } = useMutation<AuthResponse, AxiosError, SignupRequest>({
        mutationFn: (request: SignupRequest) => signup(request),
        onSuccess(data, variables, context) {
            router.push(`/auth/email-verification?email=${variables.email}`);
        },
        onError(error, variables, context) {
            // @ts-ignore
            if (error.response?.status < 500) {
                // @ts-ignore
                Object.entries(error.response?.data).forEach(err => toast.error(err[1][0]));
            }

        },
    });

    const initialValues: SignupField = {
        fullname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(field) => {
                mutate({
                    first_name: field.fullname.split(' ')[0],
                    last_name: field.fullname.split(' ')[1],
                    username: field.username,
                    email: field.email,
                    password: field.password
                });
            }}>
            {
                () => (
                    <Form className='px-4 py-8'>
                        <div className='flex flex-col space-y-3'>
                            <FormikControl
                                label='Full name'
                                name='fullname'
                                type='text'
                                control='input'
                            />

                            <FormikControl
                                label='User name'
                                name='username'
                                type='text'
                                control='input'
                            />

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

                            <FormikControl
                                label='Confirm password'
                                name='confirmPassword'
                                type='password'
                                control='input'
                            />
                        </div>

                        <Button type='submit' isLoading={isPending} disabled={isPending}
                            className='mt-6 uppercase w-full font-bold py-6'>sign up <ArrowRight className='ml-2' weight='bold' size={20} /></Button>
                    </Form>
                )
            }
        </Formik>
    )
}

export default SignupForm;