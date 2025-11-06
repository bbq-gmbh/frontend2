import { z } from 'zod';

import { command, form, query } from '$app/server';
import { error } from '@sveltejs/kit';

import { withAuthClient } from '@/server/auth';
import * as sdk from '@/backend/sdk.gen';
import { usernameSchema } from '@/schemas/auth';
import type { AppModelsEmployeeEmployee } from '@/backend/types.gen';

export const getUserById = query(z.uuidv4(), async (id) => {
	const { client } = withAuthClient({ superuser: true });
	const result = await sdk.getUserById({ client, path: { id } });

	if (!!result.data) return result.data;

	error(result.response.status, result.error.detail?.at(0)?.msg ?? 'Unknown Error');
});

export const getEmployeeById = query(z.uuidv4(), async (id) => {
	const { client } = withAuthClient({ superuser: true });
	const result = await sdk.getEmployeeByUserId({ client, path: { user_id: id } });

	if (!!result.data) return result.data as AppModelsEmployeeEmployee;

	error(result.response.status, result.error?.detail?.at(0)?.msg ?? 'Unknown Error');
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
		last_name: z.string().min(1, 'Last name required'),
		birthday: z.iso.date('Birthday required'),
		hour_model: z.string(),
		pause_time_minutes: z.int('Pause time required').min(30),
		start_from: z.iso.date('Begin from date required')
	}),
	async (data) => {
		const parsedHourModel = parseInt(data.hour_model);
		if (![6, 7, 8].includes(parsedHourModel)) {
			error(400, 'Invalid hour model. Must be 6, 7, or 8.');
		}
		const hour_model = parsedHourModel as 6 | 7 | 8;

		const { client } = withAuthClient({ superuser: true });
		const result = await sdk.createEmployee({
			client,
			body: {
				user_id: data.user_id,
				first_name: data.first_name,
				last_name: data.last_name,
				birthday: data.birthday,
				hour_model: hour_model,
				pause_time_minutes: data.pause_time_minutes,
				start_from: data.start_from
			}
		});

		await new Promise((resolve) => setTimeout(resolve, 300));

		if (result.error) {
			error(result.response.status, result.error.detail?.at(0)?.msg ?? 'Unknown Error');
		}

		await getUserById(data.user_id).refresh();
	}
);

export const editUser = command(
	z.object({
		id: z.uuidv4(),
		username: usernameSchema.optional(),
		employee: z
			.object({
				first_name: z.string().min(1).optional(),
				last_name: z.string().min(1).optional(),
				supervisor: z.uuidv4().optional().nullable()
			})
			.optional()
			.nullable()
	}),
	async (data) => {
		const { client } = withAuthClient({ superuser: true });

		const result = await sdk.patchUser({
			client,
			path: {
				id: data.id
			},
			body: {
				new_username: data.username,
				new_employee: data.employee
					? {
							new_first_name: data.employee.first_name,
							new_last_name: data.employee.last_name,
							new_supervisor_id: data.employee.supervisor
						}
					: undefined
			}
		});

		await new Promise((resolve) => setTimeout(resolve, 300));

		if (result.error) {
			error(
				result.response.status,
				result.error.detail?.at(0)?.msg ??
					(result.error.detail as string | undefined) ??
					'Unknown Error'
			);
		}

		await getUserById(data.id).refresh();
	}
);

export const searchEmployeesRemote = query(
	z.object({
		q: z.optional(z.string()),
		page: z.optional(z.int())
	}),
	async ({ q, page }) => {
		const { client } = withAuthClient({ superuser: true });
		const result = await sdk.searchUsers({
			client,
			query: {
				query: q ?? '',
				page: page ?? 0,
				page_size: 20,
				is_employee: true
			}
		});

		if (!!result.data) {
			return result.data;
		}

		return undefined;
	}
);

export const remoteLogoutAll = command(z.uuidv4(), async (id) => {
	const { client } = withAuthClient({ superuser: true });
	const result = await sdk.remoteLogoutAllSessions({ client, body: { user_id: id } });

	await new Promise((resolve) => setTimeout(resolve, 200));

	if (result.error) {
		error(result.response.status, result.error.detail?.at(0)?.msg ?? 'Unknown Error');
	}
});

export const remoteResetPassword = command(z.uuidv4(), async (id): Promise<string> => {
	const { client } = withAuthClient({ superuser: true });
	const result = await sdk.remoteResetPassword({ client, body: { user_id: id } });

	await new Promise((resolve) => setTimeout(resolve, 200));

	if (!!result.data) return result.data.new_password;

	if (result.error) {
		error(result.response.status, result.error.detail?.at(0)?.msg ?? 'Unknown Error');
	}

	error(500);
});
