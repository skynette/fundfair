/* eslint-disable react/require-default-props */
import InputControl from './InputControl';
import InputTextarea from './InputTextArea';
import SelectControl from './SelectControl';

export type SelectOptions = {
    option: string, value: string | number
}

interface ControlProps {
    name: string;
    label: string;
    type: string;
    control: string;
    options?: SelectOptions[];
    placeholder?: string;
    handleChange?: () => void;
}

export default function FormikControl({ control, ...rest }: ControlProps) {
    switch (control) {
        case 'input': return <InputControl {...rest} />
        case 'select': return <SelectControl {...rest} />
        case 'textarea': return <InputTextarea {...rest} />
        default: return null
    }
}