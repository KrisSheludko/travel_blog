import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export const registerSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export const createPostSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен').max(255, 'Заголовок не должен превышать 255 символов'),
  description: z.string().min(1, 'Описание обязательно').max(2000, 'Описание не должно превышать 2000 символов'),
  country: z.string().min(1, 'Страна обязательна'),
  city: z.string().min(1, 'Город обязателен'),
  photo: z
    .any()
    .refine(
      (file) => file instanceof File || (file instanceof FileList && file.length > 0),
      'Фото обязательно'
    )
    .refine(
      (file) => {
        if (file instanceof File) {
          return file.type === 'image/jpeg' || file.type === 'image/png';
        }
        if (file instanceof FileList && file.length > 0) {
          return file[0].type === 'image/jpeg' || file[0].type === 'image/png';
        }
        return false;
      },
      'Пожалуйста, выберите файл в формате JPEG или PNG'
    ),
});

export const createCommentSchema = z.object({
  full_name: z.string().min(1, 'Напишите имя'),
  comment: z.string().min(1, 'Добавьте текст отзыва').max(600, 'Отзыв не должен превышать 600 символов'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type CreateCommentFormData = z.infer<typeof createCommentSchema>;