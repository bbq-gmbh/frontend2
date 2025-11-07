# Frontend

A modern SvelteKit-based frontend application for the DHBW Fallstudie project. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Tech Stack

- **Framework**: SvelteKit 2.x
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x with shadcn/ui components
- **UI Components**: bits-ui
- **Icons**: Lucide icons
- **Build Tool**: Vite
- **Server Runtime**: Node.js (adapter-node)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run check` - Run SvelteKit sync and type checking
- `npm run check:watch` - Watch mode for type checking
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with Prettier
- `npm run openapi-ts` - Generate types from OpenAPI schema

## Docker Deployment

### Build the Docker image

```bash
docker build -t frontend .
```

### Run with local backend

Connects to backend running on `localhost:3001`:

```bash
docker run -p 3000:3000 \
  -e BACKEND_URL="http://localhost:3001" \
  -e ORIGIN="http://localhost:3000" \
  frontend
```

### Run with Docker host backend

Connects to backend running on the Docker host machine:

```bash
docker run -p 3000:3000 \
  -e BACKEND_URL="http://host.docker.internal:3001" \
  frontend
```

## Environment Variables

- `BACKEND_URL` - URL to the backend API server (default: `http://localhost:3001`)
- `ORIGIN` - Origin URL for CSRF protection (default: `http://localhost:3000`)

## Project Structure

```
src/
├── routes/          # SvelteKit page routes
├── lib/
│   ├── components/  # Reusable UI components
│   ├── backend/     # Backend API utilities
│   ├── hooks/       # Custom hooks
│   ├── schemas/     # Data validation schemas
│   ├── types/       # TypeScript type definitions
│   └── utils.ts     # Utility functions
├── app.html         # HTML template
├── app.css          # Global styles
└── hooks.server.ts  # Server-side hooks

static/              # Static assets
build/               # Production build output
```

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Setup Guide](./docs/SETUP.md)** - Installation and local development setup
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - Project structure and design patterns
- **[Development Guide](./docs/DEVELOPMENT.md)** - Code standards and best practices
- **[API Integration Guide](./docs/API_INTEGRATION.md)** - Backend API communication
- **[Components Guide](./docs/COMPONENTS.md)** - UI component library reference
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions

For a complete overview, see [docs/README.md](./docs/README.md).

## Contributing

Please follow the code style enforced by Prettier and ensure all type checks pass before submitting changes.

```bash
npm run format
npm run check
```

Refer to the [Development Guide](./docs/DEVELOPMENT.md) for detailed code standards and conventions.
