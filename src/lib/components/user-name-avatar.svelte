<script lang="ts">
	import { Star } from 'lucide-svelte';

  import type { UserInfo } from '@/backend';
	import type { User } from '@/types/auth';
  
	import { Badge } from '#/ui/badge';
	import UserAvatar from '#/user-avatar.svelte';

	let { user }: { user: User | UserInfo } = $props();
</script>

<div class="flex items-center gap-2">
	<UserAvatar {user} />
	<div class="grid flex-1 text-left text-sm leading-tight">
		{#if !!user.employee}
			<span class="truncate font-medium">
				{user.employee.first_name}
				{user.employee.last_name}
				{#if user.is_superuser}
					<Badge variant="outline" class="px-0.5">
						<Star />
					</Badge>
				{/if}
			</span>
			<span class="truncate text-xs">
				<span class="font-mono">{user.username}</span>
			</span>
		{:else}
			<span class="truncate font-medium">
				<span class="font-mono">{user.username}</span>
				{#if user.is_superuser}
					<Badge variant="outline" class="px-0.5">
						<Star />
					</Badge>
				{/if}
			</span>
		{/if}
	</div>
</div>
