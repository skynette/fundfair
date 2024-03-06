/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { ErrorMessage, Field, FieldProps } from 'formik';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface InputProps {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
}

function InputControl({ name, label, type, placeholder }: InputProps) {
    return (
        <div>
            <Field name={name}>
                {
                    (props: FieldProps) => (
                        <>
                            <Label htmlFor={name} className='text-gray-700 text-sm'>{label}</Label>
                            <Input type={type} {...props.field} placeholder={placeholder} className='mt-1 focus-visible:border-none focus-visible:ring-offset-0' />
                        </>
                    )
                }
            </Field>
            <ErrorMessage name={name} render={msg => <small className='text-red-500 text-xs'>{msg}</small>} />
        </div>
    )
}

export default InputControl;