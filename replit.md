# ShaamCash - Financial Technology Platform

## Overview

ShaamCash is a modern fintech application built with a full-stack TypeScript architecture. The platform is designed as a mobile-first financial service application with Arabic language support (RTL layout). The application draws inspiration from contemporary fintech platforms like Revolut, N26, and Cash App, emphasizing trust, security, and ease of use through a minimalistic dark theme interface.

The project uses a monorepo structure with shared code between client and server, featuring a React-based frontend with shadcn/ui components and an Express backend with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, configured with custom aliases for cleaner imports
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query (React Query)** for server state management and data fetching

**UI Component System**
- **shadcn/ui** component library built on Radix UI primitives in the "New York" style
- **Tailwind CSS** for utility-first styling with custom design tokens
- **class-variance-authority (CVA)** for component variant management
- **RTL (Right-to-Left)** layout support for Arabic language interface

**Design System Decisions**
- Dark theme as primary visual direction with geometric, professional elements
- Custom color system using HSL values with CSS variables for theming
- Arabic typography using Cairo/Tajawal font families loaded via Google Fonts CDN
- Mobile-first responsive design with touch-friendly interaction patterns
- Consistent spacing system based on Tailwind's 4px grid (units: 4, 6, 8, 12, 16, 20, 24, 32)

**State Management Strategy**
- Server state managed through TanStack Query with infinite stale time
- Form state handled by React Hook Form with Zod validation
- Toast notifications via shadcn/ui toast system
- No global client state management library (Redux/Zustand) - relying on React Query and component state

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for API server
- **HTTP server** created via Node's native `http` module
- Middleware stack includes JSON body parsing with raw body preservation for webhook support

**Development Features**
- Custom request logging middleware that captures duration and response data for API routes
- Vite integration in development mode with HMR (Hot Module Replacement)
- Replit-specific plugins for development banner and error overlay

**API Design**
- RESTful API structure with all routes prefixed with `/api`
- Credential-based sessions for authentication (configured in fetch requests)
- Custom query function factory pattern for consistent data fetching

### Data Storage Architecture

**Database Solution**
- **PostgreSQL** via Neon serverless database
- **Drizzle ORM** for type-safe database queries and schema management
- **Drizzle Kit** for schema migrations (output to `./migrations` directory)

**Schema Design**
- Users table with UUID primary keys (generated via PostgreSQL's `gen_random_uuid()`)
- Zod schemas generated from Drizzle schemas via `drizzle-zod` for runtime validation
- Type inference from database schema ensures end-to-end type safety

**Storage Abstraction**
- `IStorage` interface defines CRUD operations as an abstraction layer
- `MemStorage` class provides in-memory implementation for development/testing
- Designed to be swapped with database-backed implementation in production

**Session Management**
- PostgreSQL-backed sessions via `connect-pg-simple`
- Session store configured to use the same database connection

### Authentication & Authorization

**Current Implementation**
- Basic user schema with username/password fields
- Password field stored (implementation suggests hashing will be added)
- UUID-based user identification

**Planned Security Features**
- User authentication endpoints to be implemented
- Session-based authentication using Express sessions
- Credential inclusion in fetch requests already configured

### Build & Deployment

**Development Workflow**
- `npm run dev`: Starts Express server with TypeScript execution via `tsx`
- Environment set to "development" for development-specific features
- Vite dev server runs in middleware mode within Express

**Production Build**
- `npm run build`: 
  - Vite builds React app to `dist/public`
  - esbuild bundles server code to `dist/index.js` as ESM
  - External packages not bundled (marked as external)
- `npm start`: Runs production server from bundled code

**Type Checking**
- `npm run check`: Runs TypeScript compiler in no-emit mode
- Incremental compilation enabled with build info cache

### Code Organization

**Directory Structure**
- `/client` - React frontend application
  - `/src/components/ui` - shadcn/ui components
  - `/src/pages` - Route components
  - `/src/hooks` - Custom React hooks
  - `/src/lib` - Utility functions and shared logic
- `/server` - Express backend
  - `routes.ts` - API route registration
  - `storage.ts` - Data access layer
  - `vite.ts` - Development server setup
- `/shared` - Code shared between client and server
  - `schema.ts` - Database schemas and validation

**Import Aliases**
- `@/*` - Maps to `client/src/*`
- `@shared/*` - Maps to `shared/*`
- `@assets/*` - Maps to `attached_assets/*`

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless** - Neon PostgreSQL serverless driver for database connectivity
- **drizzle-orm** - TypeScript ORM for PostgreSQL with type-safe queries
- **drizzle-zod** - Integration layer for generating Zod schemas from Drizzle schemas
- **express** - Web application framework for Node.js backend
- **react** & **react-dom** - UI library for building component-based interfaces
- **vite** - Next-generation frontend build tool and dev server

### UI Component Libraries
- **@radix-ui/react-*** - Comprehensive set of unstyled, accessible UI primitives (30+ component packages including accordion, dialog, dropdown-menu, popover, select, toast, etc.)
- **shadcn/ui** - Pre-built component system built on top of Radix UI
- **lucide-react** - Icon library for UI elements
- **react-icons** - Additional icon sets (used for Android/Apple icons)

### Data Fetching & Forms
- **@tanstack/react-query** - Powerful data synchronization and caching library
- **react-hook-form** - Performant form library with validation
- **@hookform/resolvers** - Validation resolver adapters for React Hook Form
- **zod** - TypeScript-first schema validation

### Styling & UI Utilities
- **tailwindcss** - Utility-first CSS framework
- **class-variance-authority** - Tool for creating component variants
- **clsx** & **tailwind-merge** - Utilities for conditional class name merging
- **embla-carousel-react** - Carousel/slider component
- **cmdk** - Command palette/search interface
- **vaul** - Drawer component for mobile interfaces

### Development Tools
- **@replit/vite-plugin-*** - Replit-specific development enhancements
- **typescript** - Type system for JavaScript
- **tsx** - TypeScript execution engine for Node.js
- **esbuild** - Fast JavaScript bundler for production builds

### Session & Database Tools
- **connect-pg-simple** - PostgreSQL session store for Express sessions
- **drizzle-kit** - CLI tool for managing Drizzle ORM migrations

### Utilities
- **date-fns** - Modern JavaScript date utility library
- **nanoid** - Small, secure URL-friendly unique ID generator
- **wouter** - Minimalist routing library for React

### Development Dependencies (Inferred)
- PostCSS with Autoprefixer for CSS processing
- Google Fonts CDN for Arabic typography (Cairo, Tajawal families)