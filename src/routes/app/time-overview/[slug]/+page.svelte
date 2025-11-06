<script lang="ts">
	import type { PageData } from './$types';

	import { CalendarDate, parseDate } from '@internationalized/date';

	import * as Card from '#/ui/card';

	import { getEmployeeById, getUserById } from '../time-overview.remote';
	import UserNameAvatar from '#/user-name-avatar.svelte';

	let { data }: { data: PageData } = $props();
	let { userId, dateRangeStr } = data;

	let dateRange = $derived({
		start: parseDate(dateRangeStr.start),
		end: parseDate(dateRangeStr.end)
	});

	function formatDate(date: CalendarDate) {
		return `${date.day}.${date.month}.${date.year}`;
	}

	function toDateRangeStr(start: CalendarDate, end: CalendarDate) {
		return `${formatDate(start)} – ${formatDate(end)}`;
	}

	let getUser = $derived(getUserById(userId));
	let getEmployee = $derived(getEmployeeById(userId));
</script>

{#await getUser}
	<div class="text-muted-foreground">Loading...</div>
{:then user}
	{#await getEmployee}
		<div class="text-muted-foreground">Loading...</div>
	{:then employee}
		<Card.Root class="max-w-[40rem]">
			<Card.Header>
				<Card.Title>Zeitübersicht {toDateRangeStr(dateRange.start, dateRange.end)}</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-6">
				<UserNameAvatar {user} />

        <div>
					<div class="flex flex-col gap-1">
						<div>Alle Tage</div>
						<div class="text-xl">
              {dateRange.end.compare(dateRange.start) + 1} Tage
            </div>
					</div>
				</div>

				<div>
					<div class="flex flex-col gap-1">
						<div>Gesamtzahl Stunden</div>
						<div class="text-xl">40.5 Stunden</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/await}
{/await}
