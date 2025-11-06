import { query } from '$app/server';

import * as sdk from '@/backend/sdk.gen';

import { withAuthClient } from '@/server/auth';
import { error } from '@sveltejs/kit';

export const getEmployees = query(async () => {
	const { client } = withAuthClient();

	const res = await sdk.listUsers({
		client,
		query: {
			page: 0,
			page_size: 200,
			is_employee: true
		}
	});

	if (res.error) {
		error(
			res.response.status,
			res.error.detail?.at(0)?.msg ?? (res.error.detail as string | undefined) ?? 'Unknown Error'
		);
	}

	if (!!res.data) return res.data.page;

	return undefined;
});
