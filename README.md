# Simpsons Search

A character search app for The Simpsons, built with TanStack Start and server-side rendering.

## Tech Stack

- **TanStack Start** - Full-stack React framework with file-based routing and SSR streaming
- **React 19** - UI library
- **Tailwind CSS v4** - Utility-first CSS with the Vite plugin
- **Vite 8 (beta)** - Build tool and dev server
- **srvx** - Lightweight HTTP server for production
- **TypeScript** - Type safety
- **oxlint** - Fast linter

## Architecture Decisions

### SSR with TanStack Start

Each route defines a `loader` that runs on the server before rendering. Data is fetched, rendered to HTML, and streamed to the browser. After hydration, navigation becomes client-side (SPA) with server functions called via RPC.

### Server Functions

API calls to `thesimpsonsapi.com` are wrapped in `createServerFn()` and execute exclusively on the server. This keeps API logic out of the client bundle and allows server-side caching.

### In-Memory Character Cache

The search endpoint fetches all 60 pages (~1200 characters) from the external API on first request, then caches in memory. Subsequent searches filter the cached list instantly instead of making 60 API calls each time.

### Custom Production Server (`app/server.ts`)

TanStack Start generates a `fetch` handler, not a standalone HTTP server. The custom server entry:
- Exports a default `{ fetch }` object for the dev server
- In production (`NODE_ENV=production`), starts a srvx HTTP server on port 3000
- Includes a static file middleware to serve `dist/client/` assets (workaround for a srvx `serveStatic` path separator bug on Windows)

### CSS Import Strategy

Tailwind CSS is imported via `?url` suffix in `__root.tsx`, letting Vite hash and bundle it correctly for both dev and production builds. A static path like `/app/styles.css` would break in production since Vite outputs hashed filenames.

### cross-env

`NODE_ENV=production` is Unix syntax. `cross-env` makes the `start` script work on Windows, macOS, and Linux.

## Scripts

```bash
pnpm dev       # Start dev server
pnpm build     # Production build
pnpm start     # Start production server (port 3000)
pnpm lint      # Run oxlint
```

## Project Structure

```
app/
  routes/
    __root.tsx          # Root layout (HTML shell, header, footer)
    index.tsx           # Home page (random character)
    results.tsx         # Search results
    character/$id.tsx   # Character detail
  server/
    search.ts           # Search server function (cached)
    character.ts        # Character detail server function
    random.ts           # Random character server function
  components/
    Header.tsx
    Footer.tsx
    CharacterCard.tsx
    SearchTypeahead.tsx
  server.ts             # Production server entry
  client.tsx            # Client hydration entry
  router.tsx            # Router configuration
  styles.css            # Tailwind CSS entry
```
