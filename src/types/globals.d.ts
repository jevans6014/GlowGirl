// Minimal ambient declaration so the SSR `process.env` fallback in the
// Supabase client typechecks in a browser-targeted project without pulling
// in full Node types. At runtime in the browser, `process` is only reached
// after `import.meta.env` (the Vite build-time value) is falsy.
declare const process: { env: Record<string, string | undefined> };
