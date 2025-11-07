import { query } from '$app/server';
import { withAuthClient } from '@/server/auth';
import { error } from '@sveltejs/kit';

import { z } from 'zod';
import Holidays from 'date-holidays';

import type { CalendarDate } from '@internationalized/date';
import { parseDate } from '@internationalized/date';

import type { AppModelsEmployeeEmployee, TimeEntry, AbsenceEntry } from '@/backend/types.gen';
import * as sdk from '@/backend/sdk.gen';

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

		if (dateRange.start.compare(dateRange.end) > 0) {
			error(400, 'Start date must be before or equal to end date');
		}

		const dayAmount = dateRange.end.compare(dateRange.start) + 1;

		const rUser = await sdk.getUserById({ client, path: { id: user_id } });
		if (!rUser.data) err(rUser);

		const rEmployee = await sdk.getEmployeeByUserId({ client, path: { user_id } });
		if (!rEmployee.data) err(rEmployee);

		const rServerStore = await sdk.getServerStore({ client });
		if (!rServerStore.data) err(rServerStore);

		const warnungen = {
			gelb: rServerStore.data?.gleitzeit_warnung_gelb ?? 5,
			rot: rServerStore.data?.gleitzeit_warnung_rot ?? 10
		};
		if (warnungen.gelb > warnungen.rot) error(500, 'ServerStore: gelb > rot');

		const rTimeEntries = await sdk.getTimeEntries({
			client,
			body: {
				user_id: user_id,
				id: null,
				date: null,
				from_date: dateRange.start.toString(),
				to_date: dateRange.end.toString()
			}
		});
		if (!rTimeEntries.data) err(rTimeEntries);
		if (!Array.isArray(rTimeEntries.data)) error(500, 'Time entry response was not array');

		const rAbsenceEntries = await sdk.getAbsenceEntries({
			client,
			body: {
				user_id: user_id,
				id: null,
				date: null,
				from_date: dateRange.start.toString(),
				to_date: dateRange.end.toString()
			}
		});
		if (!rAbsenceEntries.data) err(rAbsenceEntries);
		if (!Array.isArray(rAbsenceEntries.data)) error(500, 'Absence entries response was not array');

		let holidays = new Holidays('DE', 'BW', {
			timezone: 'Europe/Berlin',
			types: ['public'],
			languages: 'DE'
		});

		// Cache parsed dates for time entries
		const timeEntriesWithDates = (rTimeEntries.data as TimeEntry[]).map((entry) => ({
			entry,
			date: parseDate(entry.date_time.split('T')[0])
		}));

		// Cache parsed dates for absence entries
		const absenceEntriesWithDates = (rAbsenceEntries.data as AbsenceEntry[]).map((entry) => ({
			entry,
			dateBegin: parseDate(entry.date_begin),
			dateEnd: parseDate(entry.date_end)
		}));

		const expectedWorktime = rEmployee.data!!.hour_model;
		const underage = isUnderage(rEmployee.data!!.birthday);

		const expectedPauseMinutes = rEmployee.data!!.pause_time_minutes;
		const expectedPause = expectedPauseMinutes / 60;

		// all days
		const days = Array.from({ length: dayAmount }, (_, i) => {
			const currentDate = dateRange.start.add({ days: i });

			const isHoliday = holidays.isHoliday(
				new Date(currentDate.year, currentDate.month - 1, currentDate.day)
			);

			const timeEntries: TimeEntry[] = timeEntriesWithDates
				.filter(({ date }) => date.compare(currentDate) === 0)
				.map(({ entry }) => entry);

			// Filter absence entries where current date is within the date range
			const absenceEntries: AbsenceEntry[] = absenceEntriesWithDates
				.filter(
					({ dateBegin, dateEnd }) =>
						currentDate.compare(dateBegin) >= 0 && currentDate.compare(dateEnd) <= 0
				)
				.map(({ entry }) => entry)
				.sort((a, b) => {
					// Order: sickness (sick), other, vacation (holiday)
					const order = { sickness: 0, other: 1, vacation: 2 };
					return order[a.entry_type] - order[b.entry_type];
				});

			const { totalHours, detectedIssue, beginWorkTime, endWorkTime } =
				calculateTotalTimeFromTimeEntries(timeEntries);

			const { work, pause, violates } = getWorkTimeAndPause(totalHours, expectedPause);

			const isWorkday = currentDate.day !== 0; // Sunday is 0 in JavaScript Date

			const violatesWorkHours = isInWorkHours(beginWorkTime, endWorkTime, underage);

			return {
				date: { year: currentDate.year, month: currentDate.month, day: currentDate.day },
				totalHours,
				workTime: work,
				pauseTime: pause,
				timeEntries,
				timeEntriesIssueDetected: detectedIssue,
				absenceEntries,
				absenceType: absenceEntries.at(0)?.entry_type,
				isWorkday,
				isHoliday,
				beginWorkTime,
				endWorkTime,
				violatesWorkTimeLimit: violates,
				violatesWorkHours,
				violatesRestPeriod: false
			};
		});

		// Check rest period violations
		for (let i = 1; i < days.length; i++) {
			const prevDay = days[i - 1];
			const currentDay = days[i];

			if (prevDay.endWorkTime !== undefined && currentDay.beginWorkTime !== undefined) {
				currentDay.violatesRestPeriod = violatesRestPeriod(
					prevDay.endWorkTime,
					currentDay.beginWorkTime
				);
			}
		}

		return days;
	}
);

function isUnderage(birthDate: string): boolean {
	const today = new Date();
	const birth = new Date(birthDate);

	// Calculate age
	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();

	// Adjust age if birthday hasn't occurred yet this year
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
		age--;
	}

	return age < 18;
}

function isInWorkHours(
	beginWorkTime: Date | undefined,
	endWorkTime: Date | undefined,
	underage: boolean
): boolean {
	if (beginWorkTime !== undefined) {
		if (beginWorkTime.getMinutes() / 60 < 6) return false;
		if (beginWorkTime.getMinutes() / 60 > (underage ? 20 : 22)) return false;
	}
	if (endWorkTime !== undefined) {
		if (endWorkTime.getMinutes() / 60 < 6) return false;
		if (endWorkTime.getMinutes() / 60 > (underage ? 20 : 22)) return false;
	}
	return true;
}

function calculateTotalTimeFromTimeEntries(timeEntries: TimeEntry[]): {
	totalHours: number;
	detectedIssue: boolean;
	beginWorkTime: Date | undefined;
	endWorkTime: Date | undefined;
} {
	let totalHours = 0.0;
	let lastArrivalTime: number | undefined = undefined;
	let detectedIssue = false;
	let beginWorkTime: Date | undefined = undefined;
	let endWorkTime: Date | undefined = undefined;

	// Sort entries by date_time to ensure correct order
	const sortedEntries = [...timeEntries].sort((a, b) => a.date_time.localeCompare(b.date_time));

	for (const entry of sortedEntries) {
		// Parse the time from the date_time string (format: "YYYY-MM-DDTHH:MM:SS")
		const timeParts = entry.date_time.split('T')[1].split(':');
		const hours = parseInt(timeParts[0]);
		const minutes = parseInt(timeParts[1]);
		const timeInHours = hours + minutes / 60;

		if (entry.entry_type === 'arrival') {
			// Capture the first arrival time as begin work time
			if (beginWorkTime === undefined) {
				beginWorkTime = new Date(entry.date_time);
			}
			// If there's already an unpaired arrival, that's an issue
			if (lastArrivalTime !== undefined) {
				detectedIssue = true;
			}
			// Store arrival time for next departure calculation
			lastArrivalTime = timeInHours;
		} else if (entry.entry_type === 'departure') {
			// Update end work time with each departure (last one will be the final)
			endWorkTime = new Date(entry.date_time);
			if (lastArrivalTime !== undefined) {
				// Calculate hours between arrival and departure
				totalHours += timeInHours - lastArrivalTime;
				// Reset arrival time after pairing with departure
				lastArrivalTime = undefined;
			} else {
				// Departure without preceding arrival is an issue
				detectedIssue = true;
			}
		}
	}

	// If there's still an unpaired arrival at the end, that's an issue
	if (lastArrivalTime !== undefined) {
		detectedIssue = true;
	}

	return { totalHours, detectedIssue, beginWorkTime, endWorkTime };
}

function getWorkTimeAndPause(
	totalHours: number,
	expectedPauseHours: number
): {
	work: number;
	pause: number;
	violates?: boolean;
} {
	let wHours = totalHours - expectedPauseHours;

	if (wHours < 6)
		return {
			work: wHours,
			pause: expectedPauseHours
		};

	if (wHours < 9)
		return {
			work: totalHours - (expectedPauseHours < 0.5 ? 0.5 : expectedPauseHours),
			pause: expectedPauseHours < 0.5 ? 0.5 : expectedPauseHours
		};

	return {
		work: wHours - (expectedPauseHours < 0.75 ? 0.75 : expectedPauseHours),
		pause: expectedPauseHours < 0.75 ? 0.75 : expectedPauseHours,
		violates: wHours - (expectedPauseHours < 0.75 ? 0.75 : expectedPauseHours) >= 10
	};
}

function violatesRestPeriod(preDayEndWorkTime: Date, startWorkTime: Date) {
	// if delta time is under 10 hours then true otherwise false
	// e.g. 21:00 <-> 06:00 bad
	return startWorkTime.getMinutes() / 60 + 24 - preDayEndWorkTime.getMinutes() / 60 < 10;
}
