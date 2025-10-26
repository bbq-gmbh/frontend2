import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const parentData = await parent();

	console.log(parentData);

	return {
		breadcrumbs: [...parentData.breadcrumbs, { name: '12345' }]
	};
};
