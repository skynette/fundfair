'use client';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { ArrowRight, Upload } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import FormikControl from '../form-controls/FormikControl';

interface CampaignField {
    name: string;
    description: string;
    target: string;
    deadline: string;
    category: string;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Password is required').min(20, 'Provide at least 20 characters'),
    target: Yup.string().required('Campaign target amount is required'),
    deadline: Yup.string().required('Campaign deadline is required'),
    category: Yup.string().required('Campaign category is required')
})

function CampaignForm() {
    const router = useRouter();;

    const initialValues: CampaignField = {
        name: '',
        description: '',
        target: '',
        deadline: '',
        category: ''
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(field) => {
            }}>
            {
                () => (
                    <Form className='flex flex-col space-y-4'>
                        <div className='flex items-center justify-between'>
                            <p className='text-lg font-semibold'>Create campaign</p>
                            <Button
                                // disabled={isPending}
                                // isLoading={isPending}
                                type='submit'
                                className='text-white shadow-sm rounded-lg'><Upload size={20} className='mr-2' weight='bold' /> Save</Button>
                        </div>

                        <div className='flex flex-col space-y-3'>
                            <FormikControl
                                label='Campaign name'
                                name='name'
                                type='text'
                                control='input'
                            />

                            <FormikControl
                                label='Campaign target'
                                name='target'
                                type='text'
                                control='input'
                            />

                            <FormikControl
                                control='select'
                                name='category'
                                type='select'
                                label='Campaign category'
                                placeholder='Select category'
                            />

                            <FormikControl
                                control='select'
                                name='category'
                                type='select'
                                label='Campaign category'
                                placeholder='Select category'
                            />

                            <FormikControl
                                label='Campaign description'
                                name='description'
                                type='text'
                                control='textarea'
                            />
                        </div>
                    </Form>
                )
            }
        </Formik>
    )
}

export default CampaignForm;