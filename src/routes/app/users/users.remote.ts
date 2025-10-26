import { command, form, query } from '$app/server';
import { error } from '@sveltejs/kit';

import { withAuthClient } from '@/server/auth';
import * as sdk from '@/backend/sdk.gen';

import { z } from 'zod';

export const getUsers = query(async () => {
	const { client } = withAuthClient({ superuser: true });
	const { data } = await sdk.listUsers({ client });

	if (!!data) {
		return data;
	}

	error(404, 'Not found');
});

export const deleteUser = command(z.string(), async (id) => {
	const { client } = withAuthClient({ superuser: true });
	const { data } = await sdk.listUsers({ client });

	await new Promise((resolve) => setTimeout(resolve, 1000));

  if (Math.random() < 0.5) {
    error(500, 'Random test failure');
  }

	await getUsers().refresh();
});
