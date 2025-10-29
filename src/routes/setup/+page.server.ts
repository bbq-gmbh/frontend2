import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import * as sdk from '@/backend/sdk.gen';

export const load: PageServerLoad = async ({ locals }) => {
	const { data } = await sdk.getSetupStatus();

	if (!data) error(503, 'Service not available');

	if (data.is_setup === true) {
		redirect(303, '/login');
	}

	return {
		user: locals.user!!,
		accessToken: locals.accessToken!!
	};
};
