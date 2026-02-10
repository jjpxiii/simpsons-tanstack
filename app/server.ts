import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const handler = createStartHandler(defaultStreamHandler);

// Default export for dev server
export default {
  fetch: handler,
};

// Production: start a standalone HTTP server
if (process.env.NODE_ENV === "production") {
  const { serve } = await import("srvx/node");
  const { dirname, join, extname, resolve } = await import("node:path");
  const { stat, readFile } = await import("node:fs/promises");
  const { fileURLToPath } = await import("node:url");

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const clientDir = resolve(join(__dirname, "../client"));

  const MIME_TYPES: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/vnd.microsoft.icon",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };

  serve({
    fetch: handler,
    port: 3000,
    middleware: [
      async (req, next) => {
        const url = new URL(req.url);
        const pathname = url.pathname.slice(1);
        if (!pathname || pathname.includes("..")) return next();
        const filePath = resolve(join(clientDir, pathname));
        if (!filePath.startsWith(clientDir)) return next();
        const fileStat = await stat(filePath).catch(() => null);
        if (!fileStat?.isFile()) return next();
        const ext = extname(filePath);
        const content = await readFile(filePath);
        return new Response(new Uint8Array(content), {
          headers: {
            "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
            "Content-Length": fileStat.size.toString(),
          },
        });
      },
    ],
  });
}
