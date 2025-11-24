import React from 'react';

const TextField = ({
  label,
  name,
  type = 'text',
  value = '',
  error,
  onChange,
  required,
  placeholder,
  showError = true
}) => {
  return (
    <div className="form-group">
      <label>
        {required && <span className="required-star">*</span>}
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'error' : ''}
      />
      {showError && error && error !== 'error' && (
        <div className="error-text">{error}</div>
      )}
    </div>
  );
};

export default TextField;