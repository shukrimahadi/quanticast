# QUANTICAST AI - Chart Analysis Engine

## Overview

QUANTICAST AI is an AI-powered financial chart analysis platform that provides instant grading and trade recommendations using professional trading strategies. The application allows users to upload trading chart images, select from 13+ different trading strategies (including Smart Money Concepts, Elliott Wave, Wyckoff Method, etc.), and receive comprehensive AI-generated analysis including pattern detection, key levels, trade plans, and graded recommendations (A+, A, B, C).

The platform follows a professional trading dashboard aesthetic inspired by Bloomberg Terminal and TradingView, with emphasis on data density, clarity, and fast visual scanning of critical information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Tailwind CSS with custom design system
- Shadcn/ui component library (New York style variant)
- Radix UI primitives for accessible components

**Design System:**
- Custom color palette with financial theming (bull/bear colors)
- Typography: Inter for UI, JetBrains Mono for numerical/ticker data
- Spacing scale based on Tailwind units (2, 3, 4, 6, 8, 12, 16)
- Dark mode default with professional aesthetic
- Component-driven architecture with reusable UI primitives

**State Management:**
- Local component state for UI interactions
- React Query for server data caching and synchronization
- No global state management library (Redux/Zustand) - keeps architecture simple

**Key UI Patterns:**
- Step-based workflow (UPLOAD → VALIDATING → ANALYZING → RESULTS)
- Single-page application with conditional rendering based on application state
- Real-time analysis logs for user feedback during processing
- Responsive grid layouts (mobile-first, adapts to desktop)

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js
- TypeScript throughout
- ESBuild for production bundling
- In-memory storage with interface for future database integration

**API Design:**
- RESTful endpoints
- JSON request/response format
- Multipart form data for image uploads
- Session-based architecture (prepared for authentication)

**Core Endpoints:**
- `POST /api/analyze` - Main analysis endpoint accepting strategy type and base64 image
- `GET /api/reports` - Retrieve analysis history
- `DELETE /api/reports/:id` - Remove saved reports

**AI Integration:**
- Google Generative AI (Gemini 2.5 Flash) for chart analysis via @google/genai SDK
- Two-phase AI workflow:
  1. **Validation Phase**: Determines if image is valid financial chart, extracts metadata (ticker, timeframe, price, chart type)
  2. **Analysis Phase**: Applies selected strategy to generate grading, visual analysis, trade plan, and recommendations
- Structured JSON responses with Zod schema validation
- Strategy-specific prompts for each of 13 trading methodologies
- SDK Usage: `ai.models.generateContent({ model: "gemini-2.5-flash", ... })` with `responseMimeType: "application/json"`

**Image Processing:**
- Client-side conversion to base64
- Support for multiple image formats (JPEG, PNG, WebP)
- Image validation before analysis

### Data Storage

**Current Implementation:**
- In-memory storage using Map data structures
- `IStorage` interface defines contract for storage operations
- `MemStorage` class provides current implementation

**Storage Interface:**
- Report CRUD operations (save, get, list, delete)
- User management methods (prepared for future authentication)
- Async/Promise-based API for database compatibility

**Data Models:**
- `Report`: Complete analysis result with validation, grading, trade plan, and metadata
- `User`: Basic user structure (currently unused, prepared for auth)
- `FinalAnalysis`: Comprehensive analysis output from AI
- `ValidationResponse`: Chart validation metadata
- Zod schemas for runtime type validation

**Database Readiness:**
- Drizzle ORM configured (PostgreSQL dialect)
- Schema definitions in `shared/schema.ts`
- Migration directory structure in place
- Database can be added by implementing `IStorage` interface

### External Dependencies

**AI Services:**
- **Google Generative AI (Gemini)**: Primary AI engine for chart analysis and grading
  - Requires `GEMINI_API_KEY` environment variable
  - Handles image input with multimodal capabilities
  - Processes structured JSON outputs for analysis results

**Development Tools:**
- **Replit-specific plugins**: Runtime error overlay, cartographer, dev banner (development only)
- **Vite plugins**: React, HMR, development tooling

**UI Component Libraries:**
- **Radix UI**: Accessible component primitives (accordion, dialog, dropdown, popover, select, tabs, toast, etc.)
- **Lucide React**: Icon library
- **cmdk**: Command palette component
- **date-fns**: Date manipulation
- **class-variance-authority**: Component variant styling
- **tailwind-merge & clsx**: Utility class management

**Future Integration Points:**
- PostgreSQL database (Drizzle ORM configured)
- Session store (connect-pg-simple ready for PostgreSQL sessions)
- Authentication system (passport infrastructure present)
- Real-time features (WebSocket support via 'ws' package)

**Build & Runtime:**
- TypeScript compilation with strict mode
- Path aliases for clean imports (@/, @shared/, @assets/)
- PostCSS with Tailwind and Autoprefixer
- Production bundling externalizes most dependencies except allowlisted packages for cold-start optimization