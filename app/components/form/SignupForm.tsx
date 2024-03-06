import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { ArrowRight, GoogleLogo } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import FormikControl from '../form-controls/FormikControl';

interface SignupField {
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const validationSchema = Yup.object().shape({
    fullname: Yup.string().required('Fullname is required').trim()
        .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)+$/, 'Invalid full name format. Please enter first name and last name.'),
    email: Yup.string().required('Email is required').email('Provide a valid email address'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password'), ''], 'Passwords must match')
})

function SignupForm() {
    const router = useRouter();
    // const { isPending, isSuccess, mutate } = useMutation<SignupResponse, Error, SignupRequest>({
    //     mutationFn: (request: SignupRequest) => signup(request),
    // });

    const initialValues: SignupField = {
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(field) => {
                // mutate({
                //     fullname: field.fullname,
                //     email: field.email,
                //     password: field.password
                // });
            }}>
            {
                () => (
                    <Form className='p-8'>
                        <div className='flex flex-col space-y-3'>
                            <FormikControl
                                label='Full name'
                                name='fullname'
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
                            <Button variant='link' className='p-0 -translate-y-4 text-xs text-blue-500 self-end'>Forget password?</Button>
                        </div>

                        <Button type='submit'
                            className='mt-6 uppercase w-full font-bold py-6'>sign up <ArrowRight className='ml-2' weight='bold' size={20} /></Button>

                        <div className='relative w-full max-w-full mt-4 flex items-center justify-between'>
                            <Separator className='w-[40%]' />
                            <p className='text-gray-600'>or</p>
                            <Separator className='w-[40%]' />
                        </div>

                        <Button variant='outline' className='w-full rounded-md mt-4'>
                            <GoogleLogo weight='bold' size={24} className='mr-3' />
                            Signup with Google
                        </Button>
                    </Form>
                )
            }
        </Formik>
    )
}

export default SignupForm;