# Architecture Guide

## Project Structure

```
src/
├── routes/                 # Page routes and layouts
│   ├── +layout.svelte     # Root layout
│   ├── +page.svelte       # Home page
│   ├── app/               # App section routes
│   ├── login/             # Login page
│   ├── protected/         # Protected routes (require auth)
│   └── ...
├── lib/
│   ├── components/        # Reusable Svelte components
│   ├── backend/           # Backend API utilities
│   ├── hooks/             # Custom hooks and utilities
│   ├── schemas/           # Data validation schemas
│   ├── server/            # Server-side utilities
│   ├── types/             # TypeScript type definitions
│   ├── assets/            # Static images and assets
│   ├── index.ts           # Library exports
│   ├── utils.ts           # General utilities
│   └── backend-config.ts  # Backend configuration
├── app.html               # HTML template
├── app.css                # Global styles
└── hooks.server.ts        # Server hooks
```

## Layer Architecture

### 1. **Routes Layer** (`src/routes/`)
- SvelteKit file-based routing
- Page components (`.svelte` files)
- Layout components for nested routes
- Server load functions (`+page.server.ts`, `+layout.server.ts`)

### 2. **Components Layer** (`src/lib/components/`)
- Reusable UI components
- Built with shadcn/ui and bits-ui
- Should be stateless or use component stores

### 3. **Backend Integration Layer** (`src/lib/backend/`)
- API client utilities
- Request/response handling
- Error handling and retries
- OpenAPI-generated types

### 4. **Business Logic Layer** (`src/lib/hooks/`, `src/lib/server/`)
- Custom hooks for state management
- Server-side utilities
- Authentication logic
- Data validation

### 5. **Types & Schemas Layer** (`src/lib/types/`, `src/lib/schemas/`)
- TypeScript type definitions
- Zod validation schemas
- OpenAPI-generated types

## Key Technologies

### SvelteKit
- **Server-side rendering**: Pages pre-render on the server
- **File-based routing**: Routes defined by file structure
- **Load functions**: Data fetching before page render
- **API routes**: Server-side endpoints

### Tailwind CSS
- Utility-first CSS framework
- Configured with `@tailwindcss/forms` and `@tailwindcss/typography` plugins
- Custom components in `src/lib/components/`

### shadcn/ui & bits-ui
- Accessible, customizable components
- Built on Svelte primitives
- No component dependencies beyond Svelte

### TypeScript
- Type-safe code throughout
- Strict mode enabled
- Custom type definitions for business logic

## State Management

- **Reactive Variables**: Svelte's built-in reactivity with `let` and `$:`
- **Stores**: `svelte/store` for shared state
- **Component Props**: For component communication
- **Page Context**: SvelteKit's `$page` store for route data

## Server vs Client Code

### Server Code
- `+page.server.ts` files
- `src/lib/server/` utilities
- `hooks.server.ts`
- These run only on the server

### Client Code
- `.svelte` component files
- `+page.ts` files
- `src/lib/` utilities (unless imported in server-only)
- These run in the browser

Use `+server.ts` files to create API endpoints.

## Authentication

- Implemented in `src/lib/backend/` and server hooks
- Session management through secure cookies
- Protected routes in `src/routes/protected/`
- Redirect on unauthorized access

## API Integration

- OpenAPI schema-based type generation
- Centralized backend configuration in `src/lib/backend-config.ts`
- API client utilities in `src/lib/backend/`
- Error handling and status codes management

## Build & Deployment

- **Development**: `npm run dev` (Vite with HMR)
- **Production**: `npm run build` (Node.js adapter)
- **Docker**: Node.js application served on port 3000
- **Environment variables**: `BACKEND_URL`, `ORIGIN`
