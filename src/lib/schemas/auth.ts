import { z } from 'zod';

export const loginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required')
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const usernameSchema = z
	.string('Username is required')
	.min(1, 'Username cannot be empty')
	.min(4, 'Username must be at least 4 characters')
	.max(30, 'Username must be at most 30 characters')
	.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const usernameSimpleSchema = z
	.string('Username is required')
	.min(1, 'Username cannot be empty')
	.max(30, 'Username must be at most 30 characters')
	.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const passwordSchema = z
	.string('Password is required')
	.min(1, 'Password cannot be empty')
	.min(8, 'Password must be at least 8 characters')
	.max(50, 'Password must be at most 50 characters');

export const passwordSimpleSchema = z
	.string('Password is required')
	.min(1, 'Password cannot be empty')
	.max(50, 'Password must be at most 50 characters');

export const passwordConfirmSimpleSchema = z
	.string()
	.min(1, 'Please confirm your password')
	.max(50, 'Confirmed password must be at most 50 characters');

export const registerSchema = z
	.object({
		username: usernameSchema,
		password: passwordSchema,
		confirmPassword: passwordConfirmSimpleSchema
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
	.object({
		currentPassword: passwordSimpleSchema,
		newPassword: passwordSchema,
		confirmNewPassword: passwordConfirmSimpleSchema
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords don't match",
		path: ['confirmNewPassword']
	})
	.refine((data) => data.currentPassword !== data.newPassword, {
		message: 'New password must be different from current password',
		path: ['newPassword']
	});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export function parseFormData<T>(
	formData: FormData,
	schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
	const data = Object.fromEntries(formData);
	const result = schema.safeParse(data);

	if (result.success) {
		return { success: true, data: result.data };
	}

	const errors: Record<string, string[]> = {};
	result.error.issues.forEach((issue) => {
		const path = issue.path.join('.');
		if (!errors[path]) {
			errors[path] = [];
		}
		errors[path].push(issue.message);
	});

	return { success: false, errors };
}
