<script lang="ts">
	import { getEmployees } from './employees.remote';
</script>

{#await getEmployees()}
	<span class="text-muted-foreground"> Loading... </span>
{:then employees}
	//
{:catch error}
	<span>
		Error: {JSON.stringify(error)}
	</span>
{/await}
