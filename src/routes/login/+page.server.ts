import { fail, redirect } from '@sveltejs/kit';
import { login } from '$lib/server/auth';
import { setAuthCookies } from '$lib/server/auth';
import { loginSchema, parseFormData } from '$lib/schemas/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/app');
	}

	return {};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const validation = parseFormData(formData, loginSchema);

		if (!validation.success) {
			return fail(400, {
				errors: validation.errors,
				values: {
					username: (formData.get('username') as string) || ''
				}
			});
		}

		const { username, password } = validation.data;

		const result = await login(username, password);

		if (!result.success) {
			return fail(401, {
				error: result.error,
				values: { username }
			});
		}

		setAuthCookies(cookies, result.tokens);

		redirect(302, '/app');
	}
} satisfies Actions;
