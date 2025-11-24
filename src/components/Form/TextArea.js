import React from 'react';

const TextArea = ({
  label,
  name,
  value = '',
  error,
  onChange,
  required,
  placeholder,
  showError = true,
  maxLength = 600
}) => {
  return (
    <div className="form-group">
      <label>
        {required && <span className="required-star">*</span>}
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'error' : ''}
        maxLength={maxLength}
      />
      <div className="char-counter">
        {value.length} / {maxLength}
      </div>
      {showError && error && error !== 'error' && (
        <div className="error-text">{error}</div>
      )}
    </div>
  );
};

export default TextArea;