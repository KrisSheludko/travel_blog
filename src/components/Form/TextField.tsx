import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface TextFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: 'text' | 'email' | 'password';
  error?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  register: UseFormRegister<T>;
}

const TextField = <T extends FieldValues>({
  label,
  name,
  type = 'text',
  error,
  required = false,
  placeholder,
  maxLength,
  register
}: TextFieldProps<T>): React.JSX.Element => {
  return (
    <div className="form-group">
      <label>
        {required && <span className="required-star">*</span>}
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={error ? 'error' : ''}
      />
      {error && (
        <div className="error-text">{error}</div>
      )}
    </div>
  );
};

export default TextField;