import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import {z} from "zod";

import { requireAuth } from '@/server/auth';

export const load: PageServerLoad = async ({ locals, url }) => {
	requireAuth(locals);

	let userId = locals.user!!.id;
	if (url.searchParams.has('user_id')) {
		const u = url.searchParams.get('user_id');
		if (u === null) error(400, 'user_id param was null');
		if (z.uuidv4().safeParse(u).success === false) error(400, 'user_id is invalid');
		userId = u;
	}

	return {
		user: locals.user!!,
		accessToken: locals.accessToken!!,
		userId
	};
};
