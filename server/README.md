# Server Architecture

## 📁 Project Structure

```
server/
├── config/          # Configuration and environment setup
│   └── env.ts       # Environment variables validation
├── controllers/     # Request handlers and business logic
│   └── auth.ts      # Authentication endpoints
├── middleware/      # Request middleware
│   └── auth.ts      # Authentication middleware
├── routes/          # Routing logic
│   └── router.ts    # Main router
├── services/        # External service integrations
│   └── supabase.ts  # Supabase client service
├── types/           # TypeScript type definitions
│   ├── auth.ts      # Authentication types
│   └── index.ts     # Type exports
├── utils/           # Utility functions
│   ├── auth.ts      # JWT utilities
│   └── logger.ts    # Logging utilities
└── index.ts         # Application entry point
```

## 🏗️ Architecture Overview

### **Separation of Concerns**
- **Config**: Environment setup and validation
- **Controllers**: Business logic and request handling
- **Middleware**: Cross-cutting concerns (auth, logging)
- **Routes**: URL routing and endpoint definitions
- **Services**: External service integrations
- **Types**: TypeScript interfaces and types
- **Utils**: Reusable utility functions

### **Key Features**
- ✅ Clean separation of responsibilities
- ✅ Type-safe with TypeScript interfaces
- ✅ Centralized environment management
- ✅ Reusable middleware pattern
- ✅ Structured error handling
- ✅ Consistent logging
- ✅ Scalable routing system
- ✅ Optional date field support for posts

## 🚀 API Endpoints

### Authentication
- `POST /server/auth/login` - User login
- `POST /server/auth/signup` - User signup
- `POST /auth/refresh` - Refresh access token

## 🔧 Environment Variables

Required environment variables:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - Secret key for JWT signing (minimum 32 characters)

## 📦 Dependencies

- **Deno Standard Library**: HTTP server
- **@supabase/supabase-js**: Supabase client
- **djwt**: JWT handling for Deno

## 🔍 Usage Examples

### Adding New Endpoints
1. Define types in `types/`
2. Create controller methods in `controllers/`
3. Add routes in `routes/router.ts`
4. Add middleware if needed in `middleware/`

### Adding New Services
1. Create service class in `services/`
2. Import and use in controllers
3. Add configuration in `config/env.ts` if needed
