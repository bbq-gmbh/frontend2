<script lang="ts">
	import * as Avatar from '#/ui/avatar/index.js';
	import type { User } from '@/types/auth';

	const { user }: { user: User } = $props();
</script>

<Avatar.Root class="size-8 rounded-full">
	<Avatar.Fallback class="rounded-full font-mono">
		{#if !!user.employee}
			{user.employee.first_name.substring(0, 1)}{user.employee.last_name.substring(0, 1)}
		{:else}
			{user.username.substring(0, 2)}
		{/if}
	</Avatar.Fallback>
</Avatar.Root>
