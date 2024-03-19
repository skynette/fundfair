'use client';

import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Upload } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import FormikControl, { SelectOptions } from '../form-controls/FormikControl';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Calendar } from '../ui/calendar';

import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { convertUsdToOp, formatUsdToOp } from '@/lib/utils';
import { ethers } from 'ethers';

interface CampaignField {
    name: string;
    description: string;
    target: string;
    deadline: string;
    category: string;
    type: string;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Campaign name is required'),
    description: Yup.string().required('Campaign description is required').min(20, 'Provide at least 20 characters'),
    target: Yup.number().required('Campaign target amount is required'),
    deadline: Yup.string().required('Campaign deadline is required').test('deadline', 'Campaign must run for at least 7 days',
        value => {
            return differenceInDays(parseISO(new Date(value).toISOString()), new Date()) >= 7
        }),
    category: Yup.string().required('Campaign category is required'),
    type: Yup.string().required('Campaign type is required')
})

function CampaignForm() {
    const router = useRouter();
    const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    const owner = useAddress();

    const { mutateAsync: createCampaign, isLoading } = useContractWrite(contract, "createCampaign")

    const initialValues: CampaignField = {
        name: '',
        description: '',
        target: '',
        deadline: '',
        category: '',
        type: '',
    }

    const callCreateCampaign = async (formData: CampaignField) => {
        try {
            const deadlineInSeconds = Math.floor(new Date(formData.deadline).getTime() / 1000);
            const targetInOp = await formatUsdToOp(formData.target);

            const data = await createCampaign({
                args: [owner, formData.name, formData.description, targetInOp, deadlineInSeconds, "imageurl", formData.type, formData.category]
            });
            console.info("contract call success", data);
        } catch (err) {
            console.error("contract call failure", err);
        }
    }

    const causeCategoryOption: SelectOptions[] = [
        {
            option: 'Health and Medicine',
            value: 0
        },
        {
            option: 'Environment and Wildlife',
            value: 1
        },
        {
            option: 'Education and Research',
            value: 2
        },
        {
            option: 'Poverty and Human Services',
            value: 3
        },
        {
            option: 'Arts Culture and Humanities',
            value: 4
        },
        {
            option: 'Children and Youth',
            value: 5
        },
        {
            option: 'Diaster Relief and Emergency Response',
            value: 6
        },
        {
            option: 'Animal Welfare',
            value: 7
        },
        {
            option: 'Community and Civic Projects',
            value: 8
        },
        {
            option: 'Technology and Innovation',
            value: 9
        },
        {
            option: 'Veterans and Military Families',
            value: 10
        },
        {
            option: 'Human Rights and Social Justice',
            value: 11
        },
        {
            option: 'International Aid and Development',
            value: 12
        },
        {
            option: 'Faith Based and Religious',
            value: 13
        },
        {
            option: 'Sports and Recreation',
            value: 14
        },
        {
            option: 'Mental Health and Wellness',
            value: 15
        },
    ]

    const typeOptions: SelectOptions[] = [
        {
            option: 'Fixed',
            value: 'Fixed'
        },
        {
            option: 'Flexible',
            value: 'Flexible'
        },
    ]

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(field) => {
                callCreateCampaign(field)
            }}>
            {
                (formik) => (
                    <Form className='flex flex-col space-y-4'>
                        <div className='flex items-center justify-between'>
                            <p className='text-lg font-semibold'>Create campaign</p>
                            <Button
                                disabled={!contract || isLoading}
                                isLoading={!contract || isLoading}
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
                                name='type'
                                type='select'
                                label='Campaign type'
                                placeholder='Select type'
                                options={typeOptions}
                            />

                            <FormikControl
                                control='select'
                                name='category'
                                type='select'
                                label='Campaign category'
                                placeholder='Select category'
                                options={causeCategoryOption}
                            />

                            <div className='flex flex-col space-y-1'>
                                <Field name="deadline">
                                    {
                                        ({ field, form }: FieldProps) => {
                                            return (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            type='button'
                                                            variant='outline'
                                                            className={cn(
                                                                "justify-start text-left font-normal",
                                                                field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, "PPP") : <span className='text-sm text-[#737373]'>Target deadline (DD/MM/YY)</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            captionLayout="dropdown-buttons"
                                                            selected={field.value}
                                                            onSelect={e => form.setFieldValue('deadline', e)}
                                                            {...field}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        }
                                    }
                                </Field>
                                {
                                    (formik.errors.deadline) ? <small className='text-red-500 text-xs'>{formik.errors.deadline}</small> : null
                                }
                            </div>

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