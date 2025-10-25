import { query } from '$app/server';
import { withAuthClient } from '@/server/auth';

import * as sdk from '@/backend/sdk.gen';
import { error } from '@sveltejs/kit';

export const getUsers = query(async () => {
	console.log('getUsers');

	const { client } = withAuthClient({ superuser: true });
	const { data } = await sdk.listUsers({ client });

	if (!!data) {
		return data;
	}

	error(404, 'Not found');
});
