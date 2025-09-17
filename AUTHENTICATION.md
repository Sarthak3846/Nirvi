# Authentication System

This document describes the authentication system implemented in the Nirvi application.

## Overview

The authentication system uses:
- **Password-based authentication** with PBKDF2-SHA256 hashing
- **Session-based authentication** with HTTP-only cookies
- **Middleware protection** for routes
- **SQLite database** for user and session storage

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### User Auth Providers Table
```sql
CREATE TABLE user_auth_providers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_id TEXT,
  password_hash TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

### POST /api/auth/login
Authenticate a user and create a session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "ok": true,
  "user_id": "user-uuid"
}
```

Sets an HTTP-only cookie `session_token` with the session token.

### GET /api/auth/me
Get current user information.

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

### POST /api/auth/logout
Logout the current user and invalidate the session.

**Response:**
```json
{
  "ok": true
}
```

## Security Features

1. **Password Hashing**: Uses PBKDF2-SHA256 with 100,000 iterations
2. **Session Tokens**: Cryptographically secure random tokens
3. **HTTP-Only Cookies**: Prevents XSS attacks
4. **Secure Cookies**: HTTPS-only in production
5. **Session Expiration**: Sessions expire after 7 days
6. **Constant-Time Comparison**: Prevents timing attacks on password verification

## Middleware Protection

The middleware (`src/middleware.ts`) automatically:
- Protects `/dashboard` and `/api/*` routes (except auth endpoints)
- Redirects unauthenticated users to `/login`
- Validates session tokens
- Adds user ID to request headers for API routes

## Usage

1. **Register**: Users can register at `/signup`
2. **Login**: Users can login at `/login`
3. **Protected Routes**: Access `/dashboard` requires authentication
4. **Logout**: Users can logout from the dashboard

## Migration

Run the database migrations to set up the required tables:

```bash
node scripts/migrate.js
```

Then execute the SQL commands in your database.
