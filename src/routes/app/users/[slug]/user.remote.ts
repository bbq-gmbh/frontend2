import { z } from 'zod';

import { command } from '$app/server';
import { error } from '@sveltejs/kit';

import { withAuthClient } from '@/server/auth';
import * as sdk from '@/backend/sdk.gen';

export const editUser = command(
	z.object({
		username: z.string()
	}),
	async ({ username }) => {
		const { client } = withAuthClient({ superuser: true });
		const { data } = await sdk.listUsers({ client });

		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (Math.random() < 0.5) {
			error(500, 'Random test failure');
		}
	}
);
