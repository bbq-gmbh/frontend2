import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { requireAuth } from '@/server/auth';

export const load: PageServerLoad = async ({ locals, url }) => {
	requireAuth(locals);

	let userId = locals.user!!.id;
	if (url.searchParams.has('user_id')) {
		const u = url.searchParams.get('user_id');
		if (u === null) error(400, 'user_id param was null');
		userId = u;
	}

	return {
		user: locals.user!!,
		accessToken: locals.accessToken!!,
		userId
	};
};
