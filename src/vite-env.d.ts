/**
 * Vite Environment Variables Type Declarations
 * 
 * Why do we need this file?
 * - TypeScript doesn't know about import.meta.env (Vite feature)
 * - Need to define types for environment variables
 * - Ensures type safety when using environment variables in Vite
 * 
 * Usage:
 * - import.meta.env.VITE_API_URL ✅ Type-safe
 * - import.meta.env.VITE_GOOGLE_CLIENT_ID ✅ Type-safe
 * 
 * Note: Only variables prefixed with VITE_ are exposed to the client
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
