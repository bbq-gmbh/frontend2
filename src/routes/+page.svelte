<script lang="ts">
	import type { PageData } from './$types';

	let props: { data: PageData } = $props();
	let {
		data: { user }
	} = props;
</script>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="text-center">
		<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
			Welcome to SvelteKit
		</h1>
		<p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
			Visit <a
				href="https://svelte.dev/docs/kit"
				class="text-blue-600 hover:text-blue-500 dark:text-blue-400"
			>
				svelte.dev/docs/kit
			</a> to read the documentation
		</p>

		<div class="mt-10">
			{#if user}
				<div class="rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
					<h2 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
						Authentication Status: ✅ Logged In
					</h2>
					<div class="mx-auto max-w-md space-y-2 text-left">
						{#if user.employee}
							<p class="text-gray-700 dark:text-gray-300">
								<span class="font-semibold">Name:</span>
								{user.employee.first_name}
								{user.employee.last_name}
							</p>
						{:else}
							<p class="text-gray-700 dark:text-gray-300">
								<span class="font-semibold">Username:</span>
								{user.username}
							</p>
						{/if}
						<p class="text-gray-700 dark:text-gray-300">
							<span class="font-semibold">User ID:</span>
							{user.id}
						</p>
						<p class="text-gray-700 dark:text-gray-300">
							<span class="font-semibold">Superuser:</span>
							{user.is_superuser ? 'Yes' : 'No'}
						</p>
						<p class="text-gray-700 dark:text-gray-300">
							<span class="font-semibold">Created:</span>
							{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
						</p>
					</div>
				</div>
			{:else}
				<div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
					<h2 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
						Authentication Status: ❌ Not Logged In
					</h2>
					<p class="mb-6 text-gray-700 dark:text-gray-300">
						Please log in or register to access protected features.
					</p>
					<div class="flex justify-center gap-4">
						<a
							href="/login"
							class="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
						>
							Login
						</a>
						<a
							href="/register"
							class="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-500"
						>
							Register
						</a>
					</div>
				</div>
			{/if}
		</div>

		<div class="mt-10">
			<h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
				Authentication Features
			</h3>
			<div class="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
					<h4 class="font-semibold text-gray-900 dark:text-white">JWT Authentication</h4>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Secure token-based authentication with access and refresh tokens
					</p>
				</div>
				<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
					<h4 class="font-semibold text-gray-900 dark:text-white">Auto Token Refresh</h4>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Automatic token refresh on expiration with seamless UX
					</p>
				</div>
				<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
					<h4 class="font-semibold text-gray-900 dark:text-white">Server-Side Auth</h4>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
						All API calls handled server-side for security
					</p>
				</div>
				<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
					<h4 class="font-semibold text-gray-900 dark:text-white">Secure Cookies</h4>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
						HttpOnly cookies protect against XSS attacks
					</p>
				</div>
				<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
					<h4 class="font-semibold text-gray-900 dark:text-white">Token Rotation</h4>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Invalidate all tokens with logout-all or password change
					</p>
				</div>
				<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
					<h4 class="font-semibold text-gray-900 dark:text-white">Protected Routes</h4>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Server-side protection for sensitive pages
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
