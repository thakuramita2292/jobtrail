import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter (A-Z)')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter (a-z)')
  .regex(/[0-9]/, 'Must contain at least one number (0-9)')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character (@, #, $, !, etc.)');

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const validateSingleField = (schema, formData, fieldName) => {
  const result = schema.safeParse(formData);
  if (result.success) return null;

  const fieldMessages = result.error.issues
    .filter((issue) => issue.path[0] === fieldName)
    .map((issue) => issue.message);

  return fieldMessages.length > 0 ? fieldMessages : null;
};

export const checkPasswordRules = (password = '') => [
  { label: 'At least 8 characters', met: password.length >= 8 },
  { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
  { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
  { label: 'One number (0-9)', met: /[0-9]/.test(password) },
  { label: 'One special character (@, #, $, !, etc.)', met: /[^A-Za-z0-9]/.test(password) },
];
