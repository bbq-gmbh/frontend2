<script lang="ts">
	import TimeOverviewCalendar from '#/time-overview/time-overview-calendar.svelte';
	import TimeOverview from '#/time-overview/time-overview.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-8">
	<TimeOverviewCalendar />
	<TimeOverview user_id={data.userId} />
</div>
