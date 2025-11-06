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

	let superuser = false;
	if (url.searchParams.has('superuser')) {
		const s = url.searchParams.get('superuser');
		if (s === null) error(400, 'superuser param was null');
		if (s === 'true') {
			if (!locals.user!!.is_superuser) error(401, 'Not authorized');
			superuser = true;
		}
	}

	let readonly = false;
	if (userId !== locals.user!!.id && !superuser) {
		readonly = true;
	}

	return {
		user: locals.user!!,
		accessToken: locals.accessToken!!,
		userId,
		superuser,
    readonly
	};
};
