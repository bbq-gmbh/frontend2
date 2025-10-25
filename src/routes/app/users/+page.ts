import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	return {
		...data,
		breadcrumbs: [{ name: 'Users' }]
	};
};
