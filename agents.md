# Agent Guidelines

This document provides context and best practices for AI agents working on this codebase.

## Environment

- **OS**: Windows 10/11
- **Package Manager**: pnpm (always use `pnpm` instead of `npm` or `yarn`)
- **Framework**: Next.js 15 with App Router
- **UI Library**: shadcn/ui with Tailwind CSS v4

## Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run linter
pnpm lint

# Add a shadcn component
pnpm dlx shadcn@latest add <component-name>
```

## Project Structure

```
app/                    # Next.js App Router pages and layouts
├── (auth)/            # Auth routes (sign-in, sign-up, etc.)
├── (authenticated)/   # Protected routes requiring authentication
├── (errors)/          # Error pages (401, 403, 404, 500, 503)
└── clerk/             # Clerk authentication routes

src/
├── assets/            # Brand icons, logos, custom icons
├── components/        # Reusable components
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Layout components (sidebar, header, etc.)
│   └── data-table/   # Data table components
├── context/           # React context providers
├── features/          # Feature-specific components and logic
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── stores/            # Zustand stores
└── styles/            # Global styles and theme
```

## shadcn/ui Best Practices

### Adding Components

Always use the CLI to add new shadcn components:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog
```

Components are installed to `src/components/ui/`.

### Component Configuration

The `components.json` file configures shadcn/ui:
- Components use the `@/` path alias
- Tailwind CSS is configured for the `src/` directory
- Uses `lucide-react` for icons

### Customizing Components

- Modify components directly in `src/components/ui/` after installation
- Use CSS variables from `src/styles/theme.css` for theming
- Extend with Tailwind classes using the `cn()` utility from `src/lib/utils.ts`

### Form Handling

- Use `react-hook-form` with `zod` for form validation
- shadcn Form components integrate with react-hook-form
- Example pattern in `src/features/auth/` and `src/features/settings/`

## Next.js App Router Conventions

### Client vs Server Components

- Components are Server Components by default
- Add `'use client'` directive at the top of files that use:
  - React hooks (useState, useEffect, useContext, etc.)
  - Browser APIs (window, document, localStorage)
  - Event handlers (onClick, onChange, etc.)
  - Context providers

### Route Groups

- `(auth)` - Unauthenticated routes with auth layout
- `(authenticated)` - Protected routes with sidebar layout
- `(errors)` - Error pages with minimal layout

### Layouts

- `app/layout.tsx` - Root layout with providers
- `app/(authenticated)/layout.tsx` - Authenticated layout with sidebar
- `app/providers.tsx` - Client-side providers wrapper

## Coding Standards

### Imports

```typescript
// Use path aliases
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Group imports: React, Next, external libs, internal
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
```

### TypeScript

- Prefer interfaces over types for object shapes
- Use proper typing for props and state
- Avoid `any` type

### Styling

- Use Tailwind CSS utility classes
- Use `cn()` helper for conditional classes
- Use CSS variables for theme values
- Avoid inline styles

### File Naming

- Use kebab-case for file names: `user-profile.tsx`
- Use PascalCase for component names: `UserProfile`
- Index files for feature exports: `index.ts` or `index.tsx`

## Authentication

This project supports two authentication systems:

1. **Custom Auth** (Zustand-based) - `src/stores/auth-store.ts`
2. **Clerk Auth** - `app/clerk/` routes with `@clerk/nextjs`

## Icons

- Primary icon library: `lucide-react`
- Brand icons: `src/assets/brand-icons/`
- Custom icons: `src/assets/custom/`

## State Management

- **Server State**: TanStack Query (React Query)
- **Client State**: Zustand for global state, React useState for local
- **URL State**: `useSearchParams` from Next.js for table filters/pagination



