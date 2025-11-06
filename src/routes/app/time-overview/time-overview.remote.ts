import { query } from '$app/server';
import { withAuthClient } from '@/server/auth';
import { error } from '@sveltejs/kit';

import { z } from 'zod';

import * as sdk from '@/backend/sdk.gen';
import type { AppModelsEmployeeEmployee } from '@/backend/types.gen';
import { parseDate } from '@internationalized/date';

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

export const getEmployeeById = query(z.uuidv4(), async (id) => {
	const { client } = withAuthClient();
	const result = await sdk.getEmployeeByUserId({ client, path: { user_id: id } });

	if (!!result.data) return result.data as AppModelsEmployeeEmployee;
});

function err(res: any) {
	error(
		res.response.status,
		res.error?.detail?.at(0)?.msg ?? (res.error?.detail as string | undefined) ?? 'Unknown Error'
	);
}

export const calculateOverview = query(
	z.object({
		user_id: z.uuidv4(),
		date_start: z.string(),
		date_end: z.string()
	}),
	async ({ user_id, date_start, date_end }) => {
		const { client } = withAuthClient();

		let dateRange = {
			start: parseDate(date_start),
			end: parseDate(date_end)
		};

		const result = await sdk.getEmployeeByUserId({ client, path: { user_id } });
		if (!result.data) err(result);
	}
);
