<script lang="ts">
	import type { PageData } from './$types';

	import { getUsers } from './page.remote';

	let props: { data: PageData } = $props();
	let {
		data: { user, accessToken }
	} = props;
</script>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<svelte:boundary>
		<button
			onclick={async () => {
				await getUsers().refresh();
			}}
		>
			refresh
		</button>
		{#each await getUsers() as res}
			<div>{res.username}</div>
		{/each}

    {#snippet failed(_error, reset)}
      <button onclick={reset}>oops! try again</button>
    {/snippet}
	</svelte:boundary>

	<div class="rounded-lg bg-green-50 p-8 dark:bg-green-900/20">
		<h1 class="mb-6 text-3xl font-bold text-gray-900 dark:text-white">🔒 Protected Page</h1>

		<p class="mb-6 text-lg text-gray-700 dark:text-gray-300">
			This page is only accessible to authenticated users. If you can see this, you're logged in!
		</p>

		<div class="space-y-4 rounded-lg bg-white p-6 dark:bg-gray-800">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Your Session Info:</h2>

			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<span class="font-medium text-gray-700 dark:text-gray-300">User ID:</span>
					<code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700">
						{user.id}
					</code>
				</div>

				<div class="flex items-center gap-2">
					<span class="font-medium text-gray-700 dark:text-gray-300">Username:</span>
					<code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700">
						{user.username}
					</code>
				</div>

				{#if user.employee}
					<div class="flex items-center gap-2">
						<span class="font-medium text-gray-700 dark:text-gray-300">Name:</span>
						<code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700">
							{user.employee.first_name}
						</code>
					</div>
					<div class="flex items-center gap-2">
						<span class="font-medium text-gray-700 dark:text-gray-300">Name:</span>
						<code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700">
							{user.employee.last_name}
						</code>
					</div>
				{/if}

				<div class="flex items-center gap-2">
					<span class="font-medium text-gray-700 dark:text-gray-300">Superuser:</span>
					<code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700">
						{user.is_superuser ? 'Yes' : 'No'}
					</code>
				</div>

				<div class="flex items-center gap-2">
					<span class="font-medium text-gray-700 dark:text-gray-300">Has Access Token:</span>
					<code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700">
						{accessToken ? '✅ Yes' : '❌ No'}
					</code>
				</div>
			</div>
		</div>

		<div class="mt-6">
			<a
				href="/"
				class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
			>
				← Back to Home
			</a>
		</div>
	</div>
</div>
