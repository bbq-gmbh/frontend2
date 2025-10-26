<script lang="ts">
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
  const { user } = data;
</script>

{user.username}