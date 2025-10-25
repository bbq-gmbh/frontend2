import { fail, redirect } from '@sveltejs/kit';
import { changePassword } from '$lib/server/auth';
import { clearAuthCookies } from '$lib/server/auth';
import { changePasswordSchema, parseFormData } from '$lib/schemas/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || !locals.accessToken) {
		throw redirect(302, '/login');
	}

	return {};
};

export const actions = {
	default: async ({ request, locals, cookies }) => {
		if (!locals.accessToken) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();

		const validation = parseFormData(formData, changePasswordSchema);

		if (!validation.success) {
			return fail(400, {
				errors: validation.errors
			});
		}

		const { currentPassword, newPassword } = validation.data;

		const result = await changePassword(locals.accessToken, currentPassword, newPassword);

		if (!result.success) {
			return fail(400, {
				error: result.error
			});
		}

		clearAuthCookies(cookies);

		throw redirect(302, '/login?passwordChanged=true');
	}
} satisfies Actions;
