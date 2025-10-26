<script lang="ts">
	import Button from '#/ui/button/button.svelte';
	import { Input } from '#/ui/input';
	import Label from '#/ui/label/label.svelte';
	import { Pen } from 'lucide-svelte';
	import type { PageData } from './$types';
	import UserNameAvatar from '#/user-name-avatar.svelte';

	const { data }: { data: PageData } = $props();
	const { user } = data;
</script>

<div class="flex">
  <UserNameAvatar {user} />
  <Button variant="outline" class="ml-auto">
    <Pen/>
    Edit
  </Button>
</div>

<div class="max-w-[30rem] space-y-4">
	<div class="space-y-1">
		<Label>Id</Label>
		<Input value={user.id} disabled={true} />
	</div>
	<div class="space-y-1">
		<Label>Username</Label>
		<Input value={user.username} disabled={true} />
	</div>
	<div class="space-y-1">
		<Label>Erstellt am</Label>
		<Input value={new Date(user.created_at).toLocaleDateString('de-DE')} disabled={true} />
	</div>
</div>
