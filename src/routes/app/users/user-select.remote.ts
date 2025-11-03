import { query } from '$app/server';
import { error } from '@sveltejs/kit';

import { withAuthClient } from '@/server/auth';
import * as sdk from '@/backend/sdk.gen';

import { z } from 'zod';

export const searchUsersRemote = query(
	z.object({
		q: z.optional(z.string()),
		page: z.optional(z.int())
	}),
	async ({ q, page }) => {
		const { client } = withAuthClient({ superuser: true });
		const { data } = await sdk.searchUsers({
			client,
			query: {
				query: q ?? '',
				page: page ?? 0,
				page_size: 20
			}
		});

		if (!!data) return data;

		return undefined;
	}
);

export const getUserByIdRemote = query(z.string().uuid(), async (userId) => {
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
