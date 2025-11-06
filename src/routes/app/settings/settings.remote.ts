import { z } from 'zod';

import { command, query } from '$app/server';
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

export const setServerStoreGleitzeitwarnung = command(
	z.object({
		s1: z.int().min(1).optional(),
		s2: z.int().min(1).optional()
	}),
	async (data) => {
		const { client } = withAuthClient();

		if (
			(data.s1 === undefined && data.s2 !== undefined) ||
			(data.s1 !== undefined && data.s2 === undefined)
		)
			error(400, 'Bad request');

		const res = await sdk.patchServerStoreGleitzeitWarnungen({
			client,
			query: {
				gleitzeit_warnung_gelb: data.s1,
				gleitzeit_warnung_rot: data.s2
			}
		});

		if (res.error) {
			error(res.response.status, JSON.stringify(res.error));
		}

		getServerStore().set(res.data);

		return res.data;
	}
);
