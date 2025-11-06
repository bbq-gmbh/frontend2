import { command, query } from '$app/server';
import { error } from '@sveltejs/kit';

import { z } from 'zod';

import { withAuthClient } from '@/server/auth';
import * as sdk from '@/backend/sdk.gen';
import type { AbsenceEntry, TimeEntry, UserInfo } from '@/backend';

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
	timeZone: 'Europe/Berlin',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit'
});

export const getAbsenceEntriesForDay = query(
	z.object({
		user_id: z.uuidv4(),
		day: z.date()
	}),
	async ({ user_id, day }) => {
		const { client } = withAuthClient();

		const body = {
			user_id,
			date: dateFormatter.format(day),
			id: null,
			from_date: null,
			to_date: null
		};

		const response = await sdk.getAbsenceEntries({
			client,
			body
		});

		if (response.data) {
			let data = response.data as AbsenceEntry[];

			const dict = new Map<string, UserInfo | undefined>();

			const res = await Promise.all(
				data.map(async (d) => {
					const c = dict.get(d.created_by);
					if (!c) {
						const { data } = await sdk.getUserById({ client, path: { id: d.created_by } });
						dict.set(d.created_by, data ? data : undefined);
						return {
							absenceEntry: d,
							createdBy: data
						};
					} else {
						return {
							absenceEntry: d,
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
		date_begin: z.iso.date(),
		date_end: z.iso.date(),
		entryType: z.literal(['vacation', 'sickness', 'other']),
		asSuperuser: z.boolean().optional()
	}),
	async ({ user_id, date_begin, date_end, entryType, asSuperuser }) => {
		const { client } = withAuthClient();

		const res = await sdk.createAbsenceEntry({
			client,
			body: {
				user_id,
				date_begin,
				date_end,
				entry_type: entryType
			},
			query: {
				force: asSuperuser
			}
		});

		await new Promise((resolve) => setTimeout(resolve, 300));

		if (res.error) {
			error(res.response.status, (res.error?.detail as string | undefined) ?? 'Unknown Error');
		}
	}
);

export const deleteAbsenceEntry = command(
	z.object({ id: z.int(), asSuperuser: z.boolean().optional() }),
	async ({ id, asSuperuser }) => {
		const { client } = withAuthClient();

		const res = await sdk.deleteAbsenceEntry({
			client,
			body: {
				id
			},
			query: {
				force: asSuperuser
			}
		});

		await new Promise((resolve) => setTimeout(resolve, 300));

		if (res.error) {
			error(res.response.status, (res.error?.detail as string | undefined) ?? 'Unknown Error');
		}
	}
);
