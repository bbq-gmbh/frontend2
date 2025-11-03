import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
	const { pathUserId } = await parent();

	if (!pathUserId) {
		error(404, 'User not found');
	}

	let edit = url.searchParams.get('edit') === 'true';

	return {
		pathUserId,
		edit
	};
};
