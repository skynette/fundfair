/* eslint-disable react/require-default-props */
import { ErrorMessage, Field, FieldProps } from 'formik';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface InputProps {
    name: string;
    label: string;
    type: string;
    placeholder?: any;
}

function InputTextarea({ name, label, placeholder }: InputProps) {
    return (
        <div>
            <Field name={name}>
                {
                    (props: FieldProps) => (
                        <div className='flex flex-col'>
                            <Label htmlFor={name} className='text-gray-700 text-sm'>{label}</Label>
                            <Textarea className='mt-1 block border-0 ring-[1px] ring-input rounded-md w-full text-sm'
                                id={name} placeholder={placeholder} {...props.field} />
                        </div>
                    )
                }
            </Field>
            <ErrorMessage name={name} render={msg => <small className='text-red-500 text-xs'>{msg}</small>} />
        </div>
    )
}

export default InputTextarea;