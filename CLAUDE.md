# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the marketing/landing page website for Vibe Computing, a static site deployed to Cloudflare Pages. It features a beta signup form, countdown timer, and animated demos showcasing the platform's capabilities.

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
- `styles.css` - Custom animations and styles
- `script.js` - Countdown timer, tagline animation, form handling, demo simulation
- `theme-*.html` - 6 alternative color theme variations

### Cloudflare Pages Functions
Serverless API endpoints in `functions/api/`:
- `signup.js` - Beta signup form → Airtable
- `enterprise.js` - Enterprise contact form → Airtable

Both functions follow the same pattern: validate input, POST to Airtable API, return JSON response.

### Key Integration
- **Airtable**: Beta signups stored in base `app1lloN9OOQTi7cJ`
- **Cloudflare**: Environment variable `AIRTABLE_API_KEY` must be set in dashboard

### Tailwind Configuration
Tailwind is loaded via CDN with inline config in `index.html`. Custom colors:
- `brand-*` - Teal color palette (primary)
- `accent-*` - Purple color palette (secondary)

## Environment Variables

For local development, set:
```bash
export AIRTABLE_API_KEY=your-airtable-api-key
```

For production, configure in Cloudflare Pages dashboard under Settings → Environment variables.
