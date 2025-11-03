import { z } from 'zod';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, url }) => {
	const parentData = await parent();

	let userId = z.uuidv4().safeParse(url.pathname.match(/\/users\/([^\/\?]+)/)?.[1] || '').data;

	return {
		breadcrumbs: [...parentData.breadcrumbs, { name: userId ?? '...', path: userId }],
		pathUserId: userId
	};
};
