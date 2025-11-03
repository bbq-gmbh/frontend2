<script lang="ts">
  import type { UserInfo } from '@/backend';
	import type { User } from '@/types/auth';

	import * as Avatar from '#/ui/avatar/index.js';

	let { user }: { user: User | UserInfo } = $props();
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
