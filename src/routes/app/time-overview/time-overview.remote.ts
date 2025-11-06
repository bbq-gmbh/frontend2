import { query } from '$app/server';
import { withAuthClient } from '@/server/auth';

import { z } from 'zod';

import * as sdk from '@/backend/sdk.gen';
import { error } from '@sveltejs/kit';

export const getUserById = query(z.uuidv4(), async (id) => {
	const { client } = withAuthClient();
	const result = await sdk.getUserById({ client, path: { id } });

	if (!!result.data) return result.data;

	error(
		result.response.status,
		result.error?.detail?.at(0)?.msg ??
			(result.error?.detail as string | undefined) ??
			'Unknown Error'
	);
});
