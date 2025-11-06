import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	return {
		breadcrumbs: [{ name: 'Zeitbuchung', path: '/time-entries' }]
	};
};
