import type { LayoutServerLoad } from './$types';
import { requireAuth } from '@/server/auth';

export const load: LayoutServerLoad = async ({ locals }) => {
	requireAuth(locals);

	return {
		user: locals.user!!,
		accessToken: locals.accessToken!!,
		breadcrumbs: []
	};
};
