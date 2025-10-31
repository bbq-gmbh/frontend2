import z from 'zod';
import { form, getRequestEvent } from '$app/server';
import { error, redirect } from '@sveltejs/kit';

import * as sdk from '@/backend/sdk.gen';

import { passwordSchema, usernameSchema } from '@/schemas/auth';
import { login, setAuthCookies } from '@/server/auth';

export const setupCreate = form(
	z.object({
		timezone: z.string(),
		username: usernameSchema,
		password: passwordSchema
	}),
	async (data) => {
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

		if (result.error) {
			error(400, result.error.detail?.toString() ?? 'Unknown error');
		}

		const loginResult = await login(data.username, data.password);

		if (loginResult.success === false) {
      redirect(303, "/login");
		}

    const { cookies } = getRequestEvent();

    setAuthCookies(cookies, loginResult.tokens);

    redirect(303, "/app")
	}
);
