# API Documentation

## Overview

This document provides comprehensive documentation for all API endpoints, including request/response formats, authentication requirements, and example payloads.

**Base URL**: `http://localhost:9999`

## Authentication

Most endpoints require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Access tokens can be obtained through the login or signup endpoints and are valid f3. **Create a post:**
```bash
curl -X POST http://localhost:9999/server/posts/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "mixed", "content": "Hello world!", "caption": "My first post", "image_url": "https://example.com/image.jpg", "date": "2025-07-03T10:30:00.000Z"}'
```inutes. Refresh tokens are valid for 7 days.

---

## Endpoints

### 🔐 Authentication Endpoints

#### 1. User Login
**POST** `/server/auth/login`

Authenticate a user with their password.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "password": "user_password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "created_at": "2025-07-02T16:30:00.000Z"
    },
    "tokens": {
      "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Password is required
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Database or server error

---

#### 2. User Signup
**POST** `/server/auth/signup`

Register a new user account.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "pass": "user_password"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "created_at": "2025-07-02T16:30:00.000Z"
    },
    "tokens": {
      "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Name and password are required
- `500 Internal Server Error`: Database or server error

---

#### 3. Refresh Token
**POST** `/server/auth/refresh`

Get a new access token using a refresh token.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `403 Forbidden`: Invalid refresh token
- `500 Internal Server Error`: Server error

---

### 📝 Post Endpoints

#### 4. Create Post
**POST** `/server/posts/create`

Create a new post with content and/or image. At least one of `content` or `image_url` is required.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "text", // Required: "text", "image", or "mixed"
  "content": "This is my post content", // Optional - text content
  "caption": "Optional caption for the post", // Optional - caption/description
  "image_url": "https://example.com/image.jpg", // Optional - image URL
  "date": "2025-07-03T10:30:00.000Z" // Optional: ISO string date
}
```

**Examples:**

Text only:
```json
{
  "type": "text",
  "content": "Hello world!"
}
```

Image only:
```json
{
  "type": "image",
  "image_url": "https://example.com/photo.jpg",
  "caption": "Check out this amazing photo!"
}
```

Mixed content with both text and image:
```json
{
  "type": "mixed",
  "content": "Here's what I'm working on today!",
  "image_url": "https://example.com/photo.jpg",
  "caption": "My latest project",
  "date": "2025-07-03T10:30:00.000Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "type": "mixed",
      "content": "This is my post content",
      "caption": "Optional caption for the post",
      "user_id": 1,
      "user_name": "rama",
      "image_url": "https://example.com/image.jpg",
      "date": "2025-07-03T10:30:00.000Z",
      "created_at": "2025-07-02T16:45:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: At least one of content or image_url is required / Valid post type is required (text, image, or mixed)
- `401 Unauthorized`: Authorization token is required / Invalid or expired token
- `500 Internal Server Error`: Failed to create post

---

#### 5. Get User Posts
**GET** `/server/posts/user`

Retrieve all posts for the authenticated user, ordered by creation date (latest first).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 2,
        "type": "text",
        "content": "My latest post",
        "caption": null,
        "user_id": 1,
        "user_name": "rama",
        "image_url": null,
        "date": "2025-07-03T10:30:00.000Z",
        "created_at": "2025-07-02T16:45:00.000Z"
      },
      {
        "id": 1,
        "type": "mixed",
        "content": "My first post",
        "caption": "First post ever!",
        "user_id": 1,
        "user_name": "rama",
        "image_url": "https://example.com/photo.jpg",
        "date": "2025-07-02T15:20:00.000Z",
        "created_at": "2025-07-02T16:30:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Authorization token is required / Invalid or expired token
- `500 Internal Server Error`: Database error

---

#### 6. Search Posts by User Names
**POST** `/server/posts/search`

Search for posts by multiple user names with pagination support. Returns posts from all matching users in chronological order (latest first).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "names": ["rama", "riya", "john"], // Required: Array of user names
  "page": 1, // Optional: Page number (default: 1)
  "limit": 10 // Optional: Posts per page (default: 10, max: 50)
}
```

**Examples:**

Basic search:
```json
{
  "names": ["rama", "riya"]
}
```

Search with pagination:
```json
{
  "names": ["rama", "riya", "john"],
  "page": 2,
  "limit": 20
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 5,
        "type": "image",
        "content": null,
        "caption": "Latest post from Riya",
        "user_id": 2,
        "user_name": "riya",
        "image_url": "https://example.com/riya-latest.jpg",
        "date": "2025-07-03T10:30:00.000Z",
        "created_at": "2025-07-02T17:00:00.000Z",
        "user": {
          "id": 2,
          "name": "riya"
        }
      },
      {
        "id": 3,
        "type": "text",
        "content": "Post from Rama",
        "caption": null,
        "user_id": 1,
        "user_name": "rama",
        "image_url": null,
        "date": "2025-07-02T15:20:00.000Z",
        "created_at": "2025-07-02T16:50:00.000Z",
        "user": {
          "id": 1,
          "name": "rama"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Names array is required and must not be empty / At least one valid name is required
- `401 Unauthorized`: Authorization token is required / Invalid or expired token
- `500 Internal Server Error`: Database error

---

## Data Models

### User
```typescript
{
  id: number;
  name: string;
  created_at: string; // ISO 8601 datetime
  // Note: password is never returned in responses
}
```

### Post
```typescript
{
  id: number;
  type: 'text' | 'image' | 'mixed';
  content: string | null;
  caption: string | null;
  user_id: number;
  user_name: string;
  image_url: string | null;
  date: string | null; // ISO 8601 datetime - user-specified date
  created_at: string; // ISO 8601 datetime - actual creation time
}
```

### PostWithUser (Search results)
```typescript
{
  id: number;
  type: 'text' | 'image' | 'mixed';
  content: string | null;
  caption: string | null;
  user_id: number;
  user_name: string;
  image_url: string | null;
  date: string | null; // ISO 8601 datetime - user-specified date
  created_at: string; // ISO 8601 datetime - actual creation time
  user: {
    id: number;
    name: string;
  };
}
```
  user_id: number;
  text: string | null;
  image_url: string | null;
  date: string | null; // ISO 8601 datetime - user-specified date
  created_at: string; // ISO 8601 datetime - actual creation time
  user: {
    id: number;
    name: string;
  };
}
```

### Tokens
```typescript
{
  access: string; // JWT token valid for 15 minutes
  refresh: string; // JWT token valid for 7 days
}
```

### Pagination
```typescript
{
  page: number; // Current page number
  limit: number; // Posts per page
  total: number; // Total number of posts
  totalPages: number; // Total number of pages
  hasNext: boolean; // Whether there's a next page
  hasPrev: boolean; // Whether there's a previous page
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or invalid
- **403 Forbidden**: Access denied
- **404 Not Found**: Endpoint not found
- **500 Internal Server Error**: Server error

---

## Authentication Flow

1. **Register/Login**: Use `/server/auth/signup` or `/server/auth/login` to get tokens
2. **Access Protected Routes**: Include `Authorization: Bearer <access_token>` header
3. **Token Refresh**: Use `/server/auth/refresh` with refresh token when access token expires
4. **Token Expiry**: Access tokens expire in 15 minutes, refresh tokens in 7 days

---

## Rate Limiting & Constraints

- **Search pagination**: Maximum 50 posts per page
- **Post content**: At least one of content or image_url must be provided
- **Post type**: Must be 'text', 'image', or 'mixed'
- **User names**: Case-sensitive matching
- **Token security**: Passwords are included in JWT payload for enhanced security

---

## Examples

### Complete Authentication Flow

1. **Signup:**
```bash
curl -X POST http://localhost:9999/server/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "pass": "mypassword"}'
```

2. **Create a post:**
```bash
curl -X POST http://localhost:9999/server/posts/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "mixed", "content": "Hello world!", "caption": "My first post", "image_url": "https://example.com/image.jpg"}'
```

3. **Search posts:**
```bash
curl -X POST http://localhost:9999/server/posts/search \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"names": ["John Doe"], "page": 1, "limit": 10}'
```
