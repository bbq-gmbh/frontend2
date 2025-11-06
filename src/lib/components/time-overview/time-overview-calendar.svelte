<script lang="ts">
	import RangeCalendar from '#/ui/range-calendar/range-calendar.svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';

	const end = today(getLocalTimeZone());
	const start = end.set({ day: 1 });

	let value = $state({
		start,
		end
	});
</script>

<div>
	<RangeCalendar bind:value class="rounded-md border" numberOfMonths={2} />
</div>
