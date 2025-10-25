<script lang="ts">
	import { page } from '$app/state';
</script>

<div>
	<h1 class="text-3xl font-extrabold">
    {page.status}
  </h1>
  <p>
    {page.error?.message}
  </p>
</div>
