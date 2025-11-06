import { query } from '$app/server';
import { withAuthClient } from '@/server/auth';

import * as sdk from '@/backend/sdk.gen';
import { error } from '@sveltejs/kit';

export const getServerStore = query(async () => {
	const { client } = withAuthClient();

	const res = await sdk.getServerStore({ client });

	if (res.error) {
		error(res.response.status, JSON.stringify(res.error));
	}

	return res.data;
});
