import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { requireAuth } from '@/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	requireAuth(locals);

	if (locals.user?.employee === undefined) {
		error(403, 'User is not employee');
	}

	return {
		user: locals.user!!,
		accessToken: locals.accessToken!!
	};
};
