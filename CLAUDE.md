# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing/landing page for Vibe Computing, a static site deployed to Cloudflare Pages. Features beta signup, countdown timer, and animated terminal demos.

## Development Commands

```bash
# Start local dev server (port 3000)
AIRTABLE_API_KEY=your-key python3 server.py

# Deploy to Cloudflare Pages
wrangler pages deploy ./
```

## Architecture

### Static Site Structure
- `index.html` - Main landing page with inline Tailwind config
- `styles.css` - Custom animations (particles, parallax fade, shimmer effects)
- `script.js` - Countdown timer, tagline typewriter animation, form handling, demo console simulation
- `theme-*.html` - 6 alternative color theme variations (not actively used)

### Key JavaScript Features (script.js)
- **Tagline animation**: Types "Infrastructure as Code" then replaces with "Infrastructure as Thought"
- **Countdown timer**: Counts down to `BETA_LAUNCH_DATE` (currently Jan 7, 2026)
- **Demo console**: 6 scenarios cycling automatically with typing simulation, timeline steps, and AI responses
- **Parallax fade**: Hero content fades/scales on scroll

### Cloudflare Pages Functions
Serverless API endpoints in `functions/api/`:
- `signup.js` - Beta signup form → Airtable (table `tbl31rbJHeIOgDwYM`)
- `enterprise.js` - Enterprise contact form → Airtable (requires `AIRTABLE_ENTERPRISE_TABLE_ID` env var)

Both export `onRequestPost` and `onRequestOptions` handlers, validate input, POST to Airtable API, return JSON.

### Local Development Server (server.py)
Python HTTP server that mirrors production behavior:
- Serves static files
- Handles `/api/signup` POST requests
- Routes to Airtable via `urllib`

### Tailwind Configuration
Loaded via CDN with inline config in `index.html`:
- `brand-*` - Teal color palette (primary) - #14b8a6 base
- `accent-*` - Purple color palette (secondary) - #8b5cf6 base
- `font-sans: Inter`, `font-mono: JetBrains Mono`

## Environment Variables

```bash
# Required
AIRTABLE_API_KEY=your-airtable-api-key

# Optional (for enterprise form in production)
AIRTABLE_ENTERPRISE_TABLE_ID=tblXXX
```

Production env vars: Cloudflare Pages dashboard → Settings → Environment variables

## Airtable Integration

- Base ID: `app1lloN9OOQTi7cJ`
- Beta signups table: `tbl31rbJHeIOgDwYM` (field: `Name` stores email)
- Enterprise table: configurable via `AIRTABLE_ENTERPRISE_TABLE_ID`
