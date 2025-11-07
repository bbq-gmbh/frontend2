# API Integration Guide

## Overview

This project uses OpenAPI schema to auto-generate TypeScript types and client utilities. The backend API communication is centralized and type-safe.

## Backend Configuration

Configuration is managed in `src/lib/backend-config.ts`:

```typescript
export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
```

Environment variables:
- `BACKEND_URL` - Backend API base URL (default: `http://localhost:3001`)

## OpenAPI Type Generation

### Setup

The project uses `@hey-api/openapi-ts` to generate types from OpenAPI schemas.

Configuration in `openapi-ts.config.ts`:

```typescript
// Generate types from OpenAPI schema
npm run openapi-ts
```

### Generated Files

- Types: `src/lib/types/` (auto-generated)
- Client: Created by the generator

## Making API Requests

### Basic Fetch Pattern

```typescript
// src/lib/backend/users.ts
import { BACKEND_URL } from '../backend-config';

export async function getUser(id: string) {
  const response = await fetch(`${BACKEND_URL}/api/users/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  
  return response.json();
}
```

### In Page Loads

```typescript
// src/routes/users/[id]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getUser } from '$lib/backend/users';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const user = await getUser(params.id);
    return { user };
  } catch (err) {
    error(500, 'Could not load user');
  }
};
```

### In Components

```svelte
<script lang="ts">
  import { getUser } from '$lib/backend/users';
  
  let userId = '';
  let user = null;
  let loading = false;
  let error = null;
  
  async function loadUser() {
    loading = true;
    error = null;
    try {
      user = await getUser(userId);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<button onclick={loadUser} disabled={loading}>
  {loading ? 'Loading...' : 'Load User'}
</button>

{#if error}
  <p class="error">{error}</p>
{/if}

{#if user}
  <div>User: {user.name}</div>
{/if}
```

## Request Methods

### GET Request

```typescript
export async function getItems(filter?: string) {
  const params = new URLSearchParams();
  if (filter) params.append('filter', filter);
  
  const response = await fetch(
    `${BACKEND_URL}/api/items?${params}`,
    { method: 'GET' }
  );
  return response.json();
}
```

### POST Request

```typescript
export async function createItem(data: CreateItemRequest) {
  const response = await fetch(`${BACKEND_URL}/api/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create item');
  }
  
  return response.json();
}
```

### PUT Request

```typescript
export async function updateItem(id: string, data: UpdateItemRequest) {
  const response = await fetch(`${BACKEND_URL}/api/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  return response.json();
}
```

### DELETE Request

```typescript
export async function deleteItem(id: string) {
  const response = await fetch(`${BACKEND_URL}/api/items/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete item');
  }
}
```

## Error Handling

### Error Response Pattern

```typescript
interface ErrorResponse {
  message: string;
  code: string;
  details?: unknown;
}

export async function handleError(response: Response): Promise<ErrorResponse> {
  if (!response.ok) {
    try {
      const error = await response.json();
      return error;
    } catch {
      return {
        message: `HTTP ${response.status}`,
        code: 'HTTP_ERROR'
      };
    }
  }
}
```

### Using Error Handling

```typescript
export async function getUser(id: string) {
  const response = await fetch(`${BACKEND_URL}/api/users/${id}`);
  
  if (!response.ok) {
    const error = await handleError(response);
    throw new Error(error.message);
  }
  
  return response.json();
}
```

## Authentication

### Sending Authentication

```typescript
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = getAuthToken(); // Get from store/session
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
}
```

### Using Authenticated Requests

```typescript
export async function getProfile() {
  const response = await authenticatedFetch(
    `${BACKEND_URL}/api/profile`
  );
  return response.json();
}
```

## Caching & Performance

### Query Parameters for Caching

```typescript
export async function getCachedData(id: string, cache = true) {
  const url = new URL(`${BACKEND_URL}/api/data/${id}`);
  if (!cache) {
    url.searchParams.set('cache', 'false');
  }
  
  const response = await fetch(url.toString());
  return response.json();
}
```

### Deduplication

```typescript
const requestCache = new Map<string, Promise<any>>();

export async function getCachedRequest(url: string) {
  if (!requestCache.has(url)) {
    requestCache.set(url, fetch(url).then(r => r.json()));
  }
  return requestCache.get(url);
}
```

## Types & Validation

### Using Generated Types

```typescript
import type { User, CreateUserRequest } from '$lib/types';

export async function createUser(data: CreateUserRequest): Promise<User> {
  // ...
}
```

### Input Validation with Zod

```typescript
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive()
});

export async function createUser(data: unknown) {
  const validated = userSchema.parse(data);
  // Now validated has the correct type
}
```

## API Endpoints Organization

Organize API utilities by resource:

```
lib/backend/
├── index.ts        # Export all
├── users.ts        # User endpoints
├── posts.ts        # Post endpoints
├── comments.ts     # Comment endpoints
└── auth.ts         # Authentication
```

### Example: users.ts

```typescript
import { BACKEND_URL } from '../backend-config';
import type { User, CreateUserRequest } from '$lib/types';

export async function listUsers(): Promise<User[]> {
  const response = await fetch(`${BACKEND_URL}/api/users`);
  return response.json();
}

export async function getUser(id: string): Promise<User> {
  const response = await fetch(`${BACKEND_URL}/api/users/${id}`);
  return response.json();
}

export async function createUser(data: CreateUserRequest): Promise<User> {
  const response = await fetch(`${BACKEND_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

## Regenerating Types

When the OpenAPI schema changes:

```bash
npm run openapi-ts
```

This will update all generated types and keep them in sync with the backend API.
