import { useState, useCallback } from 'react';

export const useForm = (initialState, validationRules = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;

    let newValue = value;
    if (type === 'file' && files && files[0]) {
      newValue = files[0];
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (errors.submit) {
      setErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    Object.keys(validationRules).forEach(fieldName => {
      const rule = validationRules[fieldName];
      const value = formData[fieldName];

      if (rule.required && !value?.toString().trim()) {
        newErrors[fieldName] = rule.required;
      }
      if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[fieldName] = rule.patternMessage;
      }
      if (rule.minLength && value && value.length < rule.minLength) {
        newErrors[fieldName] = rule.minLengthMessage;
      }
      if (rule.custom && value) {
        const customError = rule.custom(value, formData);
        if (customError) newErrors[fieldName] = customError;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validationRules]);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
  }, [initialState]);

  const setFieldValue = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validateForm,
    resetForm,
    setFieldValue,
    setFieldError,
    setFormData,
    setErrors
  };
};