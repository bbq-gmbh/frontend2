import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, url }) => {
	const parentData = await parent();
  
  const userId = url.pathname.match(/\/users\/([^\/\?]+)/)?.[1] || '';

	return {
		breadcrumbs: [...parentData.breadcrumbs, { name: userId, path: userId }]
	};
};
