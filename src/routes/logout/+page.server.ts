import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { clearAuthCookies, logoutAll } from '@/server/auth';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	clearAuthCookies(cookies);

	redirect(302, '/login');
};
