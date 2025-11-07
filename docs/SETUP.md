# Setup Guide

## Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn/pnpm as alternatives)
- **Git**: For cloning and version control

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- SvelteKit framework
- Tailwind CSS
- shadcn/ui components
- Development tools (TypeScript, Prettier, etc.)

### 3. Environment Configuration

Create a `.env.local` file in the project root if needed:

```
BACKEND_URL=http://localhost:3001
ORIGIN=http://localhost:3000
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port.

### Module Not Found Errors

Clear the node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Type Checking Errors

Ensure SvelteKit is properly synced:

```bash
npm run check
```

### Node Version Issues

Use `nvm` (Node Version Manager) to switch to the correct Node version:

```bash
nvm use
```

This will read the `.nvmrc` file if present.

## Next Steps

- Read the [Architecture Guide](./ARCHITECTURE.md) to understand the project structure
- Check out the [Development Guide](./DEVELOPMENT.md) for coding conventions
- Review [API Integration](./API_INTEGRATION.md) for backend communication
