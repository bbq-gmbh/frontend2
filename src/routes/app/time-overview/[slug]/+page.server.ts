import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { z } from 'zod';

import type { CalendarDate } from '@internationalized/date';
import { parseDate } from '@internationalized/date';

import { requireAuth } from '@/server/auth';

export const load: PageServerLoad = async ({ locals, url, params }) => {
	requireAuth(locals);

	let userId = locals.user!!.id;
	if (url.searchParams.has('user_id')) {
		const u = url.searchParams.get('user_id');
		if (u === null) error(400, 'user_id param was null');
		if (z.uuidv4().safeParse(u).success === false) error(400, 'user_id is invalid');
		userId = u;
	}

	// get start date and end date (required)
	// example path `[...]/time-overview/YYYY-MM-DD..YYYY-MM-DD`

	const dateRangeRegex = /^(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})$/;
	const match = params.slug?.match(dateRangeRegex);

	if (!match) {
		error(400, 'Invalid date range format. Expected: YYYY-MM-DD..YYYY-MM-DD');
	}

	const [, startDateStr, endDateStr] = match;

	let dateRangeStr: { start: string; end: string };
	try {
		dateRangeStr = {
			start: parseDate(startDateStr).toString(),
			end: parseDate(endDateStr).toString()
		};
	} catch (e) {
		error(400, 'Invalid date format in range');
	}

	if (dateRangeStr.start > dateRangeStr.end) error(400, 'Date start is after date end');

	return {
		user: locals.user!!,
		accessToken: locals.accessToken!!,
		userId,
		dateRangeStr
	};
};
