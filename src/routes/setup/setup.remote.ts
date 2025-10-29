import { command } from '$app/server';
import * as sdk from '@/backend/sdk.gen';
import { error, redirect } from '@sveltejs/kit';
import z from 'zod';

export const setupCreate = command(
	z.object({
		username: z.string(),
		password: z.string(),
		timezone: z.string()
	}),
	async (data) => {
		// await new Promise((resolve) => setTimeout(resolve, 1000));

		// if (Math.random() < 0.5) {
		// 	error(500, 'Random test failure');
		// }

		// return;

    await new Promise((resolve) => setTimeout(resolve, 500));

		const result = await sdk.setupCreate({
			body: {
				user: {
					username: data.username,
					password: data.password
				},
				server_store: {
					timezone: data.timezone
				}
			}
		});

    await new Promise((resolve) => setTimeout(resolve, 200));

		if (result.error) {
			console.log(result.error.detail?.toString());
			error(400, result.error.detail?.toString() ?? 'Unknown error');
		}
	}
);
