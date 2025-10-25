import type { CreateClientConfig } from '@/backend/client.gen';
import { BACKEND_URL } from '$env/static/private';

export const createClientConfig: CreateClientConfig = (config) => ({
	...config,
	baseUrl: BACKEND_URL
});
