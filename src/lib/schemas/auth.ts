import { z } from 'zod';

export const loginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required')
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z
	.object({
		username: z
			.string()
			.min(4, 'Username must be at least 4 characters')
			.max(50, 'Username must be at most 50 characters')
			.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must be at most 100 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Current password is required'),
		newPassword: z
			.string()
			.min(8, 'New password must be at least 8 characters')
			.max(100, 'New password must be at most 100 characters'),
		confirmNewPassword: z.string().min(1, 'Please confirm your new password')
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
