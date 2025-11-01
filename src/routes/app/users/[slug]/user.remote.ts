import { z } from 'zod';

import { command, form, query } from '$app/server';
import { error } from '@sveltejs/kit';

import { withAuthClient } from '@/server/auth';
import * as sdk from '@/backend/sdk.gen';
import { usernameSchema } from '@/schemas/auth';

export const getUserById = query(z.uuidv4(), async (id) => {
	const { client } = withAuthClient({ superuser: true });
	const result = await sdk.getUserById({ client, path: { id } });

	if (!!result.data) return result.data;

	error(result.response.status, result.error.detail?.at(0)?.msg ?? 'Unknown Error');
});

export const getUsernameExists = query(usernameSchema, async (username) => {
	const { client } = withAuthClient({ superuser: true });
	const result = await sdk.usernameExists({ client, path: { name: username } });

	if (result.response.ok) return true;
	if (result.response.status == 404) return false;
	return null;
});

export const convertToEmployee = form(
	z.object({
		user_id: z.uuidv4(),
		first_name: z.string().min(1, 'First name required'),
		last_name: z.string().min(1, 'Last name required')
	}),
	async (data) => {
		const { client } = withAuthClient({ superuser: true });
		const result = await sdk.createEmployee({ client, body: data });

		await new Promise((resolve) => setTimeout(resolve, 300));

		if (result.error) {
			error(result.response.status, result.error.detail?.at(0)?.msg ?? 'Unknown Error');
		}

		getUserById(data.user_id).refresh();
	}
);

export const editUser = command(
	z.object({
		id: z.uuidv4(),
		username: usernameSchema.optional(),
		employee: z
			.object({
				first_name: z.string().min(1),
				last_name: z.string().min(1)
			})
			.optional()
	}),
	async (data) => {
		const { user, client } = withAuthClient({ superuser: true });

		const result = await sdk.patchUser({
			client,
			path: {
				id: data.id
			},
			body: {
				new_username:
					data.username !== undefined && data.username != user.username ? data.username : undefined,
				new_employee:
					data.employee === undefined || user.employee === undefined
						? undefined
						: {
								new_first_name:
									data.employee.first_name != user.employee.first_name
										? data.employee.first_name
										: undefined,
								new_last_name:
									data.employee.last_name != user.employee.last_name
										? data.employee.last_name
										: undefined
							}
			}
		});

		await new Promise((resolve) => setTimeout(resolve, 300));

		if (result.error) {
			error(result.response.status, result.error.detail?.at(0)?.msg ?? 'Unknown Error');
		}
	}
);
