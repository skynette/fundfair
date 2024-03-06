/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import { ErrorMessage, Field, FieldProps } from 'formik';
import { nanoid } from 'nanoid';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SelectProps {
    name: string;
    label: string;
    placeholder?: string;
    options?: { option: string, value: string }[];
    handleChange?: (id: number) => void;
}

function SelectControl({ name, label, placeholder, options }: SelectProps) {
    return (
        <div>
            <Field name={name}>
                {
                    (props: FieldProps) => (
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor={name} className='text-gray-700 text-sm'>{label}</Label>
                            <Select onValueChange={(value) => {
                                props.form.setFieldValue(name, value);
                            }}>
                                <SelectTrigger className='text-xs text-gray-700 focus-visible:ring-offset-0 focus-visible:ring-2'>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        options?.map((item) => (
                                            <SelectItem key={nanoid()} id={name} value={item.value} className='text-sm'>
                                                {item.option}
                                            </SelectItem>)
                                        )
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    )
                }
            </Field>
            <ErrorMessage name={name} render={msg => <small className='text-red-500 text-xs'>{msg}</small>} />
        </div>
    )
}

export default SelectControl;