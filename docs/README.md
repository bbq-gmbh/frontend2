# Documentation Index

Welcome to the frontend documentation. Here you'll find comprehensive guides for setting up, developing, and deploying the application.

## Quick Links

### Getting Started
- **[Setup Guide](./SETUP.md)** - Installation and local development setup
  - Prerequisites and installation steps
  - Environment configuration
  - Troubleshooting common issues

### Development
- **[Architecture Guide](./ARCHITECTURE.md)** - Project structure and design patterns
  - Folder organization
  - Layer architecture
  - Key technologies
  - State management

- **[Development Guide](./DEVELOPMENT.md)** - Code standards and best practices
  - Code style and conventions
  - File organization
  - Working with API data
  - Error handling
  - Common development tasks

### API & Backend
- **[API Integration Guide](./API_INTEGRATION.md)** - Connecting to backend services
  - OpenAPI type generation
  - Making requests (GET, POST, PUT, DELETE)
  - Error handling patterns
  - Authentication
  - Caching strategies

### Components
- **[Components Guide](./COMPONENTS.md)** - UI component library
  - Available components
  - Using shadcn/ui and bits-ui
  - Creating custom components
  - Styling and accessibility
  - Component patterns

### Deployment
- **[Deployment Guide](./DEPLOYMENT.md)** - Building and deploying to production
  - Building for production
  - Docker configuration
  - Environment variables
  - Docker Compose setup
  - Production checklist
  - Troubleshooting
  - Scaling and monitoring

## Documentation Structure

```
docs/
├── README.md              # This file
├── SETUP.md               # Local development setup
├── ARCHITECTURE.md        # Project structure and design
├── DEVELOPMENT.md         # Code standards and conventions
├── API_INTEGRATION.md     # Backend API communication
├── COMPONENTS.md          # UI components guide
└── DEPLOYMENT.md          # Production deployment
```

## Common Tasks

### I want to...

- **Set up the project locally** → Read [Setup Guide](./SETUP.md)
- **Understand the project structure** → Read [Architecture Guide](./ARCHITECTURE.md)
- **Start developing** → Read [Development Guide](./DEVELOPMENT.md)
- **Connect to the backend API** → Read [API Integration Guide](./API_INTEGRATION.md)
- **Use or create UI components** → Read [Components Guide](./COMPONENTS.md)
- **Deploy the application** → Read [Deployment Guide](./DEPLOYMENT.md)

## Tech Stack Overview

- **Framework**: SvelteKit 2.x with TypeScript
- **Styling**: Tailwind CSS 4.x
- **Components**: shadcn/ui and bits-ui
- **Build Tool**: Vite
- **Deployment**: Docker with Node.js adapter
- **API Types**: OpenAPI-TS code generation

## Key Concepts

### Reactive Components
Svelte provides fine-grained reactivity. Learn about reactive declarations (`$:`) and stores for managing state.

### Server vs Client Code
SvelteKit separates server and client code. Files ending in `.server.ts` run only on the server.

### API Integration
Type-safe API calls using OpenAPI-generated types. Centralized backend configuration.

### Deployment
Containerized deployment with Docker. Environment configuration for different backends.

## Code Style

- **Format**: Prettier with default config
- **Lint**: Eslint configuration
- **Type Safety**: TypeScript with strict mode
- **Components**: PascalCase naming, TypeScript props

## Getting Help

1. Check the relevant documentation file
2. Review code examples in the guides
3. Check the project's issue tracker
4. Review the SvelteKit documentation: https://svelte.dev/docs/kit

## Contributing

When contributing:
1. Follow the [Development Guide](./DEVELOPMENT.md) for code standards
2. Run `npm run format && npm run check` before committing
3. Update relevant documentation if making changes to architecture or APIs

## Version Info

- SvelteKit: 2.43.2+
- Svelte: 5.x
- Node.js: 18.0.0+
- TypeScript: Latest

## Additional Resources

- [SvelteKit Documentation](https://svelte.dev/docs/kit)
- [Svelte Documentation](https://svelte.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
