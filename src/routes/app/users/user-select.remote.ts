import { query } from '$app/server';
import { error } from '@sveltejs/kit';

import { withAuthClient } from '@/server/auth';
import * as sdk from '@/backend/sdk.gen';

import { z } from 'zod';

export const getUserByIdRemote = query(z.uuidv4(), async (userId) => {
	const { client } = withAuthClient({ superuser: true });
	const { data, error: err } = await sdk.getUserById({
		client,
		path: { id: userId }
	});

	if (err) {
		error(500, 'Failed to fetch user');
	}

	return data;
});
