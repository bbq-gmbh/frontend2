<script lang="ts">
	import type { PageData } from './$types';

	let props: { data: PageData } = $props();
	let {
		data: { user, accessToken }
	} = props;
</script>

