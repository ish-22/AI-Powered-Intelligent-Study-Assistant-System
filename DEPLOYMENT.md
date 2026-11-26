# Deploying the Next.js frontend to Vercel

Deploy this directory as a separate Vercel project.

Set these project environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-api-project.vercel.app/api
NEXT_PUBLIC_STORAGE_URL=https://your-api-project.vercel.app/storage
NEXTAUTH_URL=https://your-frontend-project.vercel.app
AUTH_SECRET=<generate-a-long-random-secret>
NEXT_PUBLIC_USE_REAL_GOOGLE=false
```

For real Google sign-in, add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, enable the provider, and register these redirect URLs in Google Cloud:

```text
https://your-frontend-project.vercel.app/api/auth/callback/google
```

On Auth.js deployments, `AUTH_SECRET` is the preferred secret variable. `NEXTAUTH_URL` is optional for a standard Vercel URL but useful for a custom domain.

Redeploy after changing environment variables. The backend `CORS_ALLOWED_ORIGINS` value must include the exact frontend HTTPS origin.
