<script lang="ts">
  import type { LayoutServerLoad } from './$types';

	let { children, data: LayoutData }: { children: any; data: LayoutServerLoad } = $props();
</script>

{@render children?.()}
