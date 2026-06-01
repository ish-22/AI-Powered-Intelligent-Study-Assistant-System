# Best Practices Documentation - Student Authentication Module

## Backend (Hono + Cloudflare Workers)

1.  **Security Headers**: Always use secure headers (CSP, HSTS, X-Content-Type-Options) in production. Hono provides middleware for this.
2.  **Environment Secrets**: Never hardcode API keys or database URLs. Use `wrangler secrets put` to store sensitive data.
3.  **Rate Limiting**: Use Cloudflare's native rate limiting or Hono's middleware to prevent brute-force attacks on auth endpoints.
4.  **Input Filtering**: Always sanitize and validate input using Zod before processing.
5.  **Bcrypt Cost Factor**: Use a salt round of 10 or 12 for bcrypt. Higher values are more secure but slower.

## Frontend (Next.js 15 + Ant Design)

1.  **Server Components**: Use Server Components for data fetching where possible. Use Client Components only for interactive elements (forms, modals).
2.  **Auth.js v5**: Leverage the new `auth()` helper for middleware and server-side session checks.
3.  **Responsive Design**: Use Ant Design's Grid system (`Row`, `Col`) and responsive props (e.g., `xs`, `md`, `lg`) to ensure mobile compatibility.
4.  **Skeleton Loaders**: Use `Skeleton` component during data fetching to improve perceived performance.
5.  **Form Management**: Use `react-hook-form` with `zodResolver` for type-safe and performant forms.
6.  **Accessibility**: Ensure all form inputs have labels and that interactive elements are keyboard-accessible.

## Database (PostgreSQL)

1.  **UUIDs over IDs**: Use UUIDs for user identifiers to prevent sequential ID guessing.
2.  **Indexing**: Ensure columns used in frequent queries (`email`, `google_id`) are indexed.
3.  **Cascading Deletes**: Use `ON DELETE CASCADE` for tables that reference `users` (like `password_resets`) to maintain data integrity.
4.  **Last Login Tracking**: Always track `last_login_date` for audit trails and security monitoring.

## Cloudflare Turnstile

1.  **Site Key Protection**: Verify the Turnstile token on the backend before processing expensive operations (like password reset emails).
2.  **Client-Side Integration**: Use the `@marsidev/react-turnstile` package or similar for easy integration with React forms.
