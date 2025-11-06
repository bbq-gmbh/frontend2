import { command, form, query } from '$app/server';
import { error } from '@sveltejs/kit';

import { withAuthClient } from '@/server/auth';
import * as sdk from '@/backend/sdk.gen';

import { z } from 'zod';
import { passwordSchema, usernameSchema } from '@/schemas/auth';

export const getUsers = query(
	z.object({
		page: z.optional(z.int())
	}),
	async ({ page }) => {
		const { client } = withAuthClient({ superuser: true });
		const { data } = await sdk.listUsers({
			client,
			query: {
				page: page ?? 0,
				page_size: 25
			}
		});

		if (!!data) return data;

		return undefined;
	}
);

export const deleteUser = command(z.uuidv4(), async (id) => {
	const { client } = withAuthClient({ superuser: true });
	const result = await sdk.deleteUser({ client, path: { id } });

	if (result.error) {
		error(result.response.status, result.error.detail?.at(0)?.msg ?? 'Unknown Error');
	}
});

export const createUser = command(
	z.object({
		username: usernameSchema,
		password: passwordSchema
	}),
	async (body) => {
		const { client } = withAuthClient({ superuser: true });

		const res = await sdk.createUser({
			client,
			body
		});

		if (res.error) {
			error(
				res.response.status,
				res.error.detail?.at(0)?.msg ?? (res.error.detail as string | undefined) ?? 'Unknown Error'
			);
		}
	}
);
