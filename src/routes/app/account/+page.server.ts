import type { PageServerLoad } from './$types';
import { requireAuth } from '@/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.user!!,
		accessToken: locals.accessToken!!
	};
};
