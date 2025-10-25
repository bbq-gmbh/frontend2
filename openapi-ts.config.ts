import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
	input: 'http://localhost:3001/openapi.json',
	output: 'src/lib/backend',
	plugins: [
		{
			name: '@hey-api/sdk'
		},
		{
			name: '@hey-api/client-fetch',
			runtimeConfigPath: '@/backend-config.ts'
		},
		{
			name: 'zod',
			requests: true,
			responses: true
		}
	]
});
