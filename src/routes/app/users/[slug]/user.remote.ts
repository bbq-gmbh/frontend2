import { z } from 'zod';

import { command, query } from '$app/server';
import { error } from '@sveltejs/kit';

import { withAuthClient } from '@/server/auth';
import * as sdk from '@/backend/sdk.gen';

export const getUserById = query(z.uuidv4(), async (id) => {
	const { client } = withAuthClient({ superuser: true });
	const result = await sdk.getUserById({ client, path: { id } });

	if (!!result.data) return result.data;

	error(result.response.status, result.error.detail?.at(0)?.msg ?? 'Unknown Error');
});

export const editUser = command(
	z.object({
		username: z.string()
	}),
	async ({ username }) => {
		const { client } = withAuthClient({ superuser: true });

		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (Math.random() < 0.5) {
			error(500, 'Random test failure');
		}
	}
);
