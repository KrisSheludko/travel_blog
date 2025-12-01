import React from 'react';
import { UseFormRegister, UseFormHandleSubmit, UseFormWatch } from 'react-hook-form';
import { ProfileFormData as ProfileFormDataType } from '../../types';
import TextField from '../../components/Form/TextField';
import TextArea from '../../components/Form/TextArea';

interface ProfileFormProps {
    register: UseFormRegister<ProfileFormDataType>;
    handleSubmit: UseFormHandleSubmit<ProfileFormDataType>;
    onSubmit: (data: ProfileFormDataType) => Promise<void>;
    bioValue: string;
    passwordError: string;
    touchedPasswords: { password: boolean; confirmPassword: boolean };
    setTouchedPasswords: React.Dispatch<React.SetStateAction<{
        password: boolean;
        confirmPassword: boolean
    }>>;
    isSubmitting: boolean;
    isLoading: boolean;
    watch: UseFormWatch<ProfileFormDataType>;
    onCancelEdit: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
    register,
    handleSubmit,
    onSubmit,
    bioValue,
    passwordError,
    touchedPasswords,
    setTouchedPasswords,
    isSubmitting,
    isLoading,
    watch,
    onCancelEdit,
}) => {
    const fullName = watch('full_name');
    const city = watch('city');

    const isDisabled =
        isSubmitting ||
        isLoading ||
        !fullName?.trim() ||
        !city?.trim() ||
        (!!passwordError && touchedPasswords.password && touchedPasswords.confirmPassword);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
            <TextField
                label="Ф.И.О."
                name="full_name"
                error={!fullName?.trim() ? 'Ф.И.О. обязательно' : undefined}
                required={true}
                placeholder="Введите ваше полное имя"
                maxLength={255}
                register={register}
            />

            <TextField
                label="Город"
                name="city"
                error={!city?.trim() ? 'Город обязателен' : undefined}
                required={true}
                placeholder="Введите ваш город"
                maxLength={255}
                register={register}
            />

            <TextArea
                label="О себе"
                name="bio"
                placeholder="Расскажите о себе..."
                maxLength={600}
                register={register}
            />
            <div className="character-counter">
                {bioValue?.length || 0} / 600
            </div>

            <div className="password-section">
                <h3 className="password-title">Смена пароля</h3>
                <div className="password-row">
                    <div className="password-field">
                        <label htmlFor="password" className="password-label">
                            <span className="required-star">*</span>
                            Новый пароль
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', {
                                onBlur: () => setTouchedPasswords(prev => ({ ...prev, password: true })),
                            })}
                            placeholder="Новый пароль"
                            className={`password-input ${passwordError ? 'error' : ''}`}
                        />
                        {passwordError && (
                            <span className="password-error">{passwordError}</span>
                        )}
                    </div>

                    <div className="password-field">
                        <label htmlFor="confirmPassword" className="password-label">
                            <span className="required-star">*</span>
                            Повторите пароль
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register('confirmPassword', {
                                onBlur: () => setTouchedPasswords(prev => ({ ...prev, confirmPassword: true })),
                            })}
                            placeholder="Повторите пароль"
                            className={`password-input ${passwordError ? 'error' : ''}`}
                        />
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="back-button"
                    onClick={onCancelEdit}
                >
                    Назад
                </button>
                <button
                    type="submit"
                    className="save-button"
                    disabled={isDisabled}
                >
                    {(isSubmitting || isLoading) ? 'Сохранение...' : 'Сохранить'}
                </button>
            </div>
        </form>
    );
};

export default ProfileForm;