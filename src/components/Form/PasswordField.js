import React from 'react';
import TextField from './TextField';

const PasswordField = ({
  label,
  name,
  value,
  error,
  onChange,
  required = false,
  placeholder
}) => (
  <TextField
    label={label}
    name={name}
    type="password"
    value={value}
    error={error}
    onChange={onChange}
    required={required}
    placeholder={placeholder}
  />
);

export default PasswordField;