import type { PageServerLoad } from './$types';
import { requireAuth } from '@/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	requireAuth(locals, { superuser: true });

	return {
		user: locals.user!!,
		accessToken: locals.accessToken!!
	};
};
