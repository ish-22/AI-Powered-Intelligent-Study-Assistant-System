# AI-Powered Intelligent Study Assistant System - Student Authentication Module

This project contains a production-ready Student Authentication Module built with Next.js 15 (App Router).

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── register/
│   │   │       └── route.ts          # Registration API endpoint
│   │   └── profile/
│   │       └── route.ts              # Profile API endpoint
│   ├── dashboard/
│   │   └── profile/
│   │       └── page.tsx              # Profile dashboard page
│   ├── forgot-password/
│   │   └── page.tsx                  # Forgot password page
│   ├── login/
│   │   └── page.tsx                  # Login page
│   ├── register/
│   │   └── page.tsx                  # Registration page
│   ├── shared/
│   │   └── schemas.ts                # Shared Zod validation schemas
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
├── components/
│   ├── AntdProvider.tsx              # Ant Design theme provider
│   └── ChangePasswordModal.tsx       # Change password modal component
├── lib/
│   └── auth.ts                       # Auth.js configuration
├── styles/
│   └── globals.css                   # Global styles
├── database_schema.sql               # PostgreSQL schema
├── next.config.mjs
├── tailwind.config.js
└── tsconfig.json
```

## Tech Stack

- **Frontend & Backend**: Next.js 15, TypeScript.
- **UI Framework**: Ant Design (AntD).
- **Authentication**: Auth.js (NextAuth v5) with Credentials & Google Provider.
- **Validation**: Zod + React Hook Form.
- **Security**: bcrypt for hashing, JWT sessions, Cloudflare Turnstile.
- **Database**: PostgreSQL (Supabase recommended).

## Getting Started

### Prerequisites

1.  **Node.js**: v18 or later.
2.  **Supabase**: A PostgreSQL database instance.
3.  **Google OAuth**: Credentials from Google Cloud Console.

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
DATABASE_URL=your_supabase_postgres_url
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key
```

### Installation

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Initialize Database**:
    Run the SQL script `database_schema.sql` on your Supabase SQL Editor.

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Features

- ✅ Student Registration (bcrypt, Turnstile, Zod validation).
- ✅ Student Login (Email/Password & Google OAuth).
- ✅ Password Management (Forgot/Reset/Change password).
- ✅ Profile Dashboard (Edit profile, view account info).
- ✅ Responsive UI with Dark/Light mode (Ant Design).

## Security Notes

- All passwords are hashed using `bcrypt` before storage.
- Session management is handled by Auth.js using the JWT strategy.
- Public endpoints protected by Cloudflare Turnstile.
- Input validation strictly enforced using Zod schemas.
