# Backend Structure

This directory contains the backend logic and services for the application.

## Directory Structure

```
lib/
├── services/          # Business logic services
│   ├── auth.service.ts    # Authentication operations
│   └── user.service.ts    # User management operations
├── actions/           # Server Actions (Next.js)
│   └── auth.actions.ts    # Server-side auth actions
├── types/             # TypeScript types
│   └── api.types.ts       # API request/response types
├── firebase.ts        # Firebase configuration
└── utils.ts           # Utility functions
```

## Services (`lib/services/`)

Services contain business logic and database operations. They are reusable functions that can be called from:
- API routes (`app/api/`)
- Server Actions (`lib/actions/`)
- Server Components

### Available Services

#### `auth.service.ts`
- `signUpWithEmail()` - Create new user account
- `signInWithEmail()` - Sign in with email/password
- `signInWithGoogle()` - Sign in with Google OAuth
- `resendEmailVerification()` - Resend verification email
- `signOutUser()` - Sign out current user
- `getUserData()` - Get user data from Firestore

#### `user.service.ts`
- `getUserProfile()` - Get user profile by UID
- `updateUserProfile()` - Update user profile
- `getUserByEmail()` - Find user by email

## Server Actions (`lib/actions/`)

Server Actions are Next.js functions that run on the server. They can be called directly from client components.

### Available Actions

#### `auth.actions.ts`
- `signUpAction()` - Server action for signup
- `signInAction()` - Server action for login
- `resendVerificationAction()` - Server action for resending verification

## API Routes (`app/api/`)

RESTful API endpoints that can be called from anywhere (client, server, external).

### Available Endpoints

#### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/verify-email` - Resend verification email

#### Users
- `GET /api/users/[uid]` - Get user profile
- `PATCH /api/users/[uid]` - Update user profile

## Usage Examples

### Using Services in API Routes

```typescript
// app/api/auth/signup/route.ts
import { signUpWithEmail } from "@/lib/services/auth.service"

export async function POST(request: NextRequest) {
  const data = await request.json()
  const result = await signUpWithEmail(data)
  return NextResponse.json({ success: true, data: result })
}
```

### Using Server Actions in Components

```typescript
// components/signup-form.tsx
"use client"
import { signUpAction } from "@/lib/actions/auth.actions"

const handleSubmit = async () => {
  const result = await signUpAction(formData)
  if (result.success) {
    // Handle success
  }
}
```

### Using API Routes from Client

```typescript
// components/login-form.tsx
"use client"

const handleSubmit = async () => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await response.json()
}
```

## Best Practices

1. **Services** - Use for reusable business logic
2. **Server Actions** - Use for form submissions and mutations from client components
3. **API Routes** - Use when you need REST endpoints or external API access
4. **Keep components thin** - Move logic to services/actions

