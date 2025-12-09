# QUANTICAST AI - Local Development Setup

## Prerequisites

- Node.js 20+ (https://nodejs.org/)
- npm (comes with Node.js)
- A code editor (Cursor AI, VS Code, etc.)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:

- **GEMINI_API_KEY**: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **SESSION_SECRET**: Any random string (use a password generator)

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5000**

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities & types
│   │   └── hooks/       # Custom React hooks
├── server/              # Express backend
│   ├── routes.ts        # API endpoints
│   ├── gemini.ts        # AI integration
│   └── storage.ts       # Data storage
├── shared/              # Shared types & schemas
└── design_guidelines.md # UI/UX design reference
```

## Key Features

- **Chart Analysis**: Upload trading charts for AI grading (A+, A, B, C)
- **14 Trading Strategies**: SMC, ICT, Elliott Wave, Wyckoff, etc.
- **Market Grounding**: Real-time search for earnings, news, events
- **Trade DNA Radar**: Pentagon visualization of analysis scores
- **TradingView Integration**: Live charts with ticker switching

## API Endpoints

- `POST /api/analyze` - Analyze a chart image
- `GET /api/reports` - Get analysis history
- `DELETE /api/reports/:id` - Delete a report

## Troubleshooting

### "GEMINI_API_KEY not found"
Make sure you created `.env` file with your API key.

### Port 5000 already in use
Kill the process using port 5000 or change the port in `server/index.ts`.

### Module not found errors
Run `npm install` again to ensure all dependencies are installed.

## Need Help?

Check the `replit.md` file for detailed architecture documentation.
