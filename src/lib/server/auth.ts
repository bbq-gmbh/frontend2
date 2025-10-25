import * as jose from 'jose';
import { error, redirect } from '@sveltejs/kit';

import * as sdk from '@/backend/sdk.gen';
import { createClient, type Client } from '@/backend/client';

import type { User, AuthTokens } from '$lib/types/auth';
import { getRequestEvent } from '$app/server';
import { client } from '@/backend/client.gen';

const TOKEN_COOKIE_NAME = 'access_token';
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

const BASE_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: true,
	sameSite: 'lax' as const,
	path: '/'
};

function decodeToken(
	token: string
): { sub: string; key: string; exp: number; kind: string } | null {
	try {
		const decoded = jose.decodeJwt(token);
		return decoded as any;
	} catch {
		return null;
	}
}

function isTokenExpired(token: string): boolean {
	const decoded = decodeToken(token);
	if (!decoded || !decoded.exp) return true;

	const now = Math.floor(Date.now() / 1000);
	return decoded.exp < now;
}

function calculateCookieMaxAge(token: string): number {
	const decoded = decodeToken(token);
	if (!decoded || !decoded.exp) {
		return 60 * 10;
	}

	const nowUtc = Math.floor(Date.now() / 1000);
	const tokenLifetime = decoded.exp - nowUtc;
	const adjustedLifetime = tokenLifetime - 60 * 2;

	return Math.max(adjustedLifetime, Math.min(60 * 5, tokenLifetime));
}

export async function register(
	username: string,
	password: string
): Promise<{ success: true; tokens: AuthTokens } | { success: false; error: string }> {
	try {
		const res = await sdk.registerUser({
			body: { username, password }
		});

		if (res.error) {
			const errorMsg = Array.isArray(res.error.detail)
				? res.error.detail[0]?.msg || 'Registration failed'
				: res.error.detail || 'Registration failed';
			return { success: false, error: errorMsg };
		}

		if (!res.data) {
			return { success: false, error: 'No response data' };
		}

		return {
			success: true,
			tokens: {
				accessToken: res.data.access_token,
				refreshToken: res.data.refresh_token
			}
		};
	} catch (error: any) {
		return { success: false, error: error.message || 'Registration failed' };
	}
}

export async function login(
	username: string,
	password: string
): Promise<{ success: true; tokens: AuthTokens } | { success: false; error: string }> {
	try {
		const res = await sdk.loginUser({
			body: { username, password }
		});

		if (res.error) {
			const errorMsg = Array.isArray(res.error.detail)
				? res.error.detail[0]?.msg || 'Login failed'
				: res.error.detail || 'Login failed';
			return { success: false, error: errorMsg };
		}

		if (!res.data) {
			return { success: false, error: 'No response data' };
		}

		return {
			success: true,
			tokens: {
				accessToken: res.data.access_token,
				refreshToken: res.data.refresh_token
			}
		};
	} catch (error: any) {
		return { success: false, error: error.message || 'Login failed' };
	}
}

export async function refreshAccessToken(
	refreshToken: string
): Promise<{ success: true; tokens: AuthTokens } | { success: false; error: string }> {
	try {
		const res = await sdk.refreshTokens({
			headers: {
				Authorization: `Bearer ${refreshToken}`
			}
		});

		if (res.error) {
			return { success: false, error: 'Token refresh failed' };
		}

		if (!res.data) {
			return { success: false, error: 'No response data' };
		}

		return {
			success: true,
			tokens: {
				accessToken: res.data.access_token,
				refreshToken: res.data.refresh_token
			}
		};
	} catch (error: any) {
		return { success: false, error: error.message || 'Token refresh failed' };
	}
}

export async function getCurrentUser(accessToken: string): Promise<User | null> {
	try {
		const decoded = decodeToken(accessToken);
		if (!decoded) return null;

		const { data } = await sdk.me({
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		if (!data) return null;

		return {
			id: data.id,
			username: data.username,
			is_superuser: data.is_superuser,
			created_at: data.created_at,
			employee: data.employee ?? undefined
		};
	} catch (error) {
		console.error('Failed to get current user:', error);
		return null;
	}
}

export async function logoutAll(accessToken: string): Promise<boolean> {
	try {
		const res = await sdk.logoutAllSessions({
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		return !res.error;
	} catch (error) {
		console.error('Logout failed:', error);
		return false;
	}
}

export async function changePassword(
	accessToken: string,
	currentPassword: string,
	newPassword: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const res = await sdk.changePassword({
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			body: {
				current_password: currentPassword,
				new_password: newPassword
			}
		});

		if (res.error) {
			const errorMsg = Array.isArray(res.error.detail)
				? res.error.detail[0]?.msg || 'Password change failed'
				: res.error.detail || 'Password change failed';
			return { success: false, error: errorMsg };
		}

		return { success: true };
	} catch (error: any) {
		return { success: false, error: error.message || 'Password change failed' };
	}
}

export function setAuthCookies(cookies: any, tokens: AuthTokens) {
	const accessTokenMaxAge = calculateCookieMaxAge(tokens.accessToken);
	const refreshTokenMaxAge = calculateCookieMaxAge(tokens.refreshToken);

	cookies.set(TOKEN_COOKIE_NAME, tokens.accessToken, {
		...BASE_COOKIE_OPTIONS,
		maxAge: accessTokenMaxAge
	});
	cookies.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
		...BASE_COOKIE_OPTIONS,
		maxAge: refreshTokenMaxAge
	});
}

export function clearAuthCookies(cookies: any) {
	cookies.delete(TOKEN_COOKIE_NAME, { path: '/' });
	cookies.delete(REFRESH_TOKEN_COOKIE_NAME, { path: '/' });
}

export function getTokensFromCookies(cookies: any): {
	accessToken: string | null;
	refreshToken: string | null;
} {
	return {
		accessToken: cookies.get(TOKEN_COOKIE_NAME) ?? null,
		refreshToken: cookies.get(REFRESH_TOKEN_COOKIE_NAME) ?? null
	};
}

export async function validateSession(cookies: any): Promise<{
	user: User | null;
	accessToken: string | null;
}> {
	const { accessToken, refreshToken } = getTokensFromCookies(cookies);

	if (!accessToken && !refreshToken) {
		return { user: null, accessToken: null };
	}

	if (!!accessToken && !isTokenExpired(accessToken)) {
		const user = await getCurrentUser(accessToken);
		return { user, accessToken };
	}

	if (!!refreshToken) {
		const refreshResult = await refreshAccessToken(refreshToken);

		if (refreshResult.success) {
			const accessTokenMaxAge = calculateCookieMaxAge(refreshResult.tokens.accessToken);
			const refreshTokenMaxAge = calculateCookieMaxAge(refreshResult.tokens.refreshToken);

			cookies.set(TOKEN_COOKIE_NAME, refreshResult.tokens.accessToken, {
				...BASE_COOKIE_OPTIONS,
				maxAge: accessTokenMaxAge
			});
			cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshResult.tokens.refreshToken, {
				...BASE_COOKIE_OPTIONS,
				maxAge: refreshTokenMaxAge
			});

			const user = await getCurrentUser(refreshResult.tokens.accessToken);
			return { user, accessToken: refreshResult.tokens.accessToken };
		}
	}

	clearAuthCookies(cookies);
	return { user: null, accessToken: null };
}

export function requireAuth(locals: App.Locals, args: { superuser?: boolean } = {}) {
	if (!locals.user || !locals.accessToken) {
		redirect(302, '/login');
	}

	if (args.superuser && !locals.user.is_superuser) {
		error(403, 'Forbidden');
	}
}

export function withAuthClient(args: { superuser?: boolean } = {}): {
	user: User;
	client: Client;
} {
	const { locals } = getRequestEvent();

	if (!locals.user || !locals.accessToken) {
		error(401, 'Unauthorized');
	}

	if (args.superuser && !locals.user.is_superuser) {
		error(403, 'Forbidden');
	}

	return {
		user: locals.user,
		client: createClient({
			...client.getConfig(),
			headers: {
				Authorization: `Bearer ${locals.accessToken}`
			}
		})
	};
}
