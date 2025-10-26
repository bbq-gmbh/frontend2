import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, url }) => {
	const parentData = await parent();

	return {
		breadcrumbs: [...parentData.breadcrumbs, { name: '12345' }]
	};
};
