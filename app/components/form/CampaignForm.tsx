'use client';

import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Upload, Image as ImageIcon, XCircle, } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import FormikControl, { SelectOptions } from '../form-controls/FormikControl';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { causeCategoryOption, cn, typeOptions } from '@/lib/utils';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Calendar } from '../ui/calendar';

import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { convertUsdToOp, formatUsdToOp } from '@/lib/utils';
import { ethers } from 'ethers';
import { useState } from 'react';
import { Label } from '../ui/label';
import Dropzone from 'react-dropzone';
import { Input } from '../ui/input';
import Image from 'next/image';
import { nanoid } from 'nanoid';
import { useMutation } from '@tanstack/react-query';
import { CampaignRequest } from '@/lib/network/campaign/CampaignRequest';
import { AxiosError } from 'axios';
import { createCampaign } from '@/lib/api/campaign/endpoint';
import { toast } from 'sonner';

interface CampaignField {
    title: string;
    description: string;
    target: string;
    deadline: string;
    category: string;
    type: string;
    image: any;
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Campaign title is required'),
    description: Yup.string().required('Campaign description is required').min(20, 'Provide at least 20 characters'),
    target: Yup.number().required('Campaign target amount is required'),
    deadline: Yup.string().required('Campaign deadline is required').test('deadline', 'Campaign must run for at least 7 days',
        value => {
            return differenceInDays(parseISO(new Date(value).toISOString()), new Date()) >= 7
        }),
    category: Yup.string().required('Campaign category is required'),
    type: Yup.string().required('Campaign type is required'),
    image: Yup.mixed().required('Provide at least one product image'),
})

function CampaignForm() {
    const router = useRouter();
    const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    const owner = useAddress();
    const [previewImage, setPreviewImage] = useState<any[]>([]);

    // const { mutateAsync: createCampaign, isLoading } = useContractWrite(contract, "createCampaign")

    const initialValues: CampaignField = {
        title: '',
        description: '',
        target: '',
        deadline: '',
        category: '',
        type: '',
        image: [],
    }

    const { mutate, isPending } = useMutation<CampaignRequest, AxiosError, any>({
        mutationFn: (req: CampaignRequest) => createCampaign(req),
        onSuccess(data, variables, context) {
            toast.success(`Campaign ${data.title} has been created`);
            router.back();
        },
        onError(error, variables, context) {
            if (error.response?.status === 400) {
                console.log(error.response.data)
                // @ts-ignore
                Object.values(error.response?.data).forEach((value) => toast.error(value[0]));
            }
        },
    })

    const callCreateCampaign = async (formData: CampaignField) => {
        mutate({
            owner, ...formData
        });
    }

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
                                disabled={isPending}
                                isLoading={isPending}
                                type='submit'
                                className='text-white shadow-sm rounded-lg'><Upload size={20} className='mr-2' weight='bold' /> Save</Button>
                        </div>

                        <div className='flex flex-col space-y-3'>
                            <FormikControl
                                label='Campaign title'
                                name='title'
                                type='text'
                                control='input'
                            />

                            <FormikControl
                                label='Campaign target (USD)'
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

                            <div className=''>
                                <div className='flex flex-col space-y-2'>
                                    {
                                        formik.errors && <p className='text-xs text-red-600 font-normal'>{formik.errors?.image?.toString()}</p>
                                    }

                                    <Label htmlFor='image' className='text-gray-700 text-sm'>Photo(s)</Label>
                                    <Field name='image'>
                                        {
                                            (props: FieldProps) => (
                                                <Dropzone maxFiles={1} accept={{
                                                    'image/jpeg': [],
                                                    'image/png': []
                                                }} onDrop={acceptedFiles => {
                                                    const prevFiles = props.form.getFieldProps('image').value;
                                                    const curr = prevFiles ? [...prevFiles, acceptedFiles[0]] : prevFiles;
                                                    props.form.setFieldValue('image', curr);
                                                    acceptedFiles.forEach((file) => {
                                                        const reader = new FileReader();
                                                        reader.onload = () => {
                                                            setPreviewImage(prev => ([...prev, reader.result]));
                                                        }
                                                        reader.readAsDataURL(file);
                                                    })
                                                }}>
                                                    {({ getRootProps, getInputProps, isDragActive }) => (
                                                        <div {...getRootProps()} className='flex flex-col items-center text-center p-10 rounded-lg border-2 border-dashed border-primary'>
                                                            <Input {...getInputProps()} />
                                                            <ImageIcon size={48} weight='regular' />
                                                            {
                                                                isDragActive ?
                                                                    <p className='text-primary font-semibold text-lg'>Drop the files here ...</p> :
                                                                    <p className='text-sm font-medium text-primary'>Drag and drop image here, or click to add image</p>
                                                            }
                                                            {/* <p className='text-[#444A5B] text-[14px] font-normal'>Maximum file size: 50 MB</p> */}
                                                        </div>
                                                    )}
                                                </Dropzone>
                                            )
                                        }
                                    </Field>
                                </div>
                                {
                                    previewImage.length > 0 &&
                                    <div className='flex mt-2 space-x-2 items-center justify-center bg-slate-200 p-2'>
                                        {
                                            previewImage.map((img, index) => (
                                                <div key={nanoid()} className='relative'>
                                                    <Image src={img} width={150} height={150} alt='' />
                                                    <Button type='button' onClick={() => {
                                                        const images = formik.values.image;
                                                        images.splice(index, 1);
                                                        previewImage.splice(index, 1);
                                                        formik.setFieldValue('image', images);
                                                        setPreviewImage(previewImage);
                                                    }}
                                                        className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'
                                                        variant='ghost'
                                                        size='icon'>
                                                        <XCircle className='rounded-full bg-black text-white w-8 h-8' strokeWidth={1} />
                                                    </Button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </Form>
                )
            }
        </Formik>
    )
}

export default CampaignForm;