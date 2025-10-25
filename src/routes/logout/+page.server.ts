import { redirect } from '@sveltejs/kit';
import { clearAuthCookies, logoutAll } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions = {
	default: async ({ cookies, locals }) => {
		if (locals.accessToken) {
			await logoutAll(locals.accessToken);
		}

		clearAuthCookies(cookies);

		throw redirect(302, '/');
	}
} satisfies Actions;
