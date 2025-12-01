import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface TextAreaProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  error?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  register: UseFormRegister<T>;
}

const TextArea = <T extends FieldValues>({
  label,
  name,
  error,
  required,
  placeholder,
  maxLength = 600,
  register
}: TextAreaProps<T>): React.JSX.Element => {
  return (
    <div className="form-group">
      <label>
        {required && <span className="required-star">*</span>}
        {label}
      </label>
      <textarea
        {...register(name)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={error ? 'error' : ''}
        rows={4}
      />
      {error && (
        <div className="error-text">{error}</div>
      )}
    </div>
  );
};

export default TextArea;