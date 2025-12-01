import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import TextField from './TextField';

interface PasswordFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  error?: string;
  required?: boolean;
  placeholder?: string;
  register: UseFormRegister<T>;
}

const PasswordField = <T extends FieldValues>({
  label,
  name,
  error,
  required = false,
  placeholder,
  register
}: PasswordFieldProps<T>): React.JSX.Element => (
  <TextField
    label={label}
    name={name}
    type="password"
    error={error}
    required={required}
    placeholder={placeholder}
    register={register}
  />
);

export default PasswordField;