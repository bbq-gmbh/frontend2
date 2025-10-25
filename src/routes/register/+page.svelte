<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let username = $state(form?.values?.username || '');
	let password = $state('');
	let confirmPassword = $state('');
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
				Create your account
			</h2>
		</div>

		<form method="POST" class="mt-8 space-y-6">
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
						minlength="4"
						bind:value={username}
						class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						class:border-red-500={form?.errors?.username}
						placeholder="Choose a username (min 4 characters)"
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
						minlength="8"
						bind:value={password}
						class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						class:border-red-500={form?.errors?.password}
						placeholder="Choose a password (min 8 characters)"
					/>
					{#if form?.errors?.password}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">
							{form.errors.password[0]}
						</p>
					{/if}
				</div>

				<div>
					<label
						for="confirmPassword"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
						minlength="8"
						bind:value={confirmPassword}
						class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						class:border-red-500={form?.errors?.confirmPassword}
						placeholder="Confirm your password"
					/>
					{#if form?.errors?.confirmPassword}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">
							{form.errors.confirmPassword[0]}
						</p>
					{/if}
				</div>
			</div>

			<div>
				<button
					type="submit"
					class="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				>
					Register
				</button>
			</div>

			<div class="text-center text-sm">
				<span class="text-gray-600 dark:text-gray-400">Already have an account?</span>
				<a href="/login" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
					Sign in here
				</a>
			</div>
		</form>
	</div>
</div>
