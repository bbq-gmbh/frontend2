import { command, query } from '$app/server';
import { error } from '@sveltejs/kit';

import { z } from 'zod';

import { withAuthClient } from '@/server/auth';
import * as sdk from '@/backend/sdk.gen';
import type { TimeEntry, UserInfo } from '@/backend';

export const getTimeEntriesForDay = query(
	z.object({
		user_id: z.uuidv4(),
		day: z.date()
	}),
	async ({ user_id, day }) => {
		const { client } = withAuthClient();

		const body = {
			user_id,
			date: day.toISOString().slice(0, 10),
			id: null,
			from_date: null,
			to_date: null
		};

		const response = await sdk.getTimeEntries({
			client,
			body
		});

		console.log(JSON.stringify(response));

		if (response.data) {
			let data = response.data as TimeEntry[];

			const dict = new Map<string, UserInfo | undefined>();

			const res = await Promise.all(
				data.map(async (d) => {
					const c = dict.get(d.created_by);
					if (!c) {
						const { data } = await sdk.getUserById({ client, path: { id: d.created_by } });
						dict.set(d.created_by, data ? data : undefined);
						return {
							timeEntry: d,
							createdBy: data
						};
					} else {
						return {
							timeEntry: d,
							createdBy: c
						};
					}
				})
			);

			return res;
		}

		error(response.response.status, JSON.stringify(response.error));
	}
);

export const createTimeEntry = command(
	z.object({
		user_id: z.uuidv4(),
		dateTime: z.iso.datetime(),
		entryType: z.literal(['arrival', 'departure'])
	}),
	async ({ user_id, dateTime, entryType }) => {
		const { client } = withAuthClient();

		const res = await sdk.createTimeEntry({
			client,
			body: {
				user_id,
				date_time: dateTime,
				entry_type: entryType
			}
		});

		if (res.error) {
			error(res.response.status, (res.error?.detail as string | undefined) ?? 'Unknown Error');
		}

		getTimeEntriesForDay({
			user_id,
			day: new Date(dateTime)
		}).refresh();
	}
);
