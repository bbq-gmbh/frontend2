<script lang="ts">
	import { page } from '$app/state';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let username = $state(form?.values?.username || '');
	let password = $state('');

	let passwordChanged = $derived(page.url.searchParams.get('passwordChanged') === 'true');
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
				Sign in to your account
			</h2>
		</div>

		<form method="POST" class="mt-8 space-y-6">
			{#if passwordChanged}
				<div class="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
					<p class="text-sm text-green-800 dark:text-green-200">
						Password changed successfully! Please log in with your new password.
					</p>
				</div>
			{/if}

			{#if form?.error}
				<div class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
					<p class="text-sm text-red-800 dark:text-red-200">{form.error}</p>
				</div>
			{/if}

			<div class="space-y-4 rounded-md shadow-sm">
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Username
					</label>
					<input
						id="username"
						name="username"
						type="text"
						required
						bind:value={username}
						class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						class:border-red-500={form?.errors?.username}
						placeholder="Enter your username"
					/>
					{#if form?.errors?.username}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">
							{form.errors.username[0]}
						</p>
					{/if}
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						bind:value={password}
						class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						class:border-red-500={form?.errors?.password}
						placeholder="Enter your password"
					/>
					{#if form?.errors?.password}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">
							{form.errors.password[0]}
						</p>
					{/if}
				</div>
			</div>

			<div>
				<button
					type="submit"
					class="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				>
					Sign in
				</button>
			</div>

			<div class="text-center text-sm">
				<span class="text-gray-600 dark:text-gray-400">Don't have an account?</span>
				<a
					href="/register"
					class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
				>
					Register here
				</a>
			</div>
		</form>
	</div>
</div>
