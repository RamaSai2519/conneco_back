# Conneco Backend - New Structure Documentation

## Overview
The conneco_back project has been restructured to match the architecture pattern used in the gamesProcessor project. This provides better organization, scalability, and maintainability.

## Key Changes Made

### 1. **Project Structure**
```
src/
├── index.py                    # Main Flask application entry point
├── requirements.txt           # Python dependencies
├── shared/                    # Shared modules and utilities
│   ├── configs/              # Configuration management
│   │   ├── __init__.py       # Environment-based config loader
│   │   ├── dev_config.py     # Development configuration
│   │   ├── main_config.py    # Production configuration
│   │   └── local_config.py   # Local development configuration
│   ├── db/                   # Database layer
│   │   ├── base.py          # Database connection singleton
│   │   └── users.py         # User and post database operations
│   └── uniservices/         # Universal services
│       └── after_request.py # After request handler
├── services/                 # Business logic layer
│   ├── controller.py        # Service imports
│   └── src/                 # Service implementations
│       ├── auth.py          # Authentication services
│       └── posts.py         # Post services
└── models/                  # Data models (renamed from types)
    ├── auth.py             # Authentication models
    └── post.py             # Post models
```

### 2. **Architecture Changes**

#### **Configuration System**
- **Before**: Single `env_config` module with hardcoded values
- **After**: Environment-based configuration with `dev_config.py`, `main_config.py`, and `local_config.py`
- **Usage**: `from shared.configs import CONFIG as config`

#### **Database Layer**
- **Before**: Complex async MongoDB service with interfaces
- **After**: Simple synchronous MongoDB operations using singleton pattern
- **Usage**: `from shared.db.users import create_user, get_user_by_password`

#### **Service Layer**
- **Before**: Complex route handlers with decorators
- **After**: Flask-RESTful Resource classes in `services/src/`
- **Usage**: Each service is a Resource class with HTTP methods

#### **Request/Response Handling**
- **Before**: Mangum for Lambda integration
- **After**: aws-wsgi for Lambda integration
- **Before**: Manual response formatting
- **After**: Standardized JSON responses

### 3. **API Endpoints**
All endpoints remain the same:
- `POST /server/auth/login` - User login
- `POST /server/auth/signup` - User registration
- `POST /server/auth/refresh` - Token refresh
- `POST /server/posts/create` - Create post
- `GET /server/posts/user` - Get user posts
- `POST /server/posts/search` - Search posts

### 4. **Environment Configuration**

#### **Development (ENV=dev or default)**
- Database: `mongodb://localhost:27017/conneco`
- JWT Secret: Development key
- Debug: Enabled

#### **Production (ENV=main)**
- Database: Production MongoDB connection
- JWT Secret: Production key
- Debug: Disabled

#### **Local (ENV=local)**
- Database: Local MongoDB
- JWT Secret: Local key
- Debug: Enabled

### 5. **Database Collections**
- **Users**: `conneco.users` (was using connection from env_config)
- **Posts**: `conneco.posts` (was using connection from env_config)

### 6. **Dependencies**
Updated `requirements.txt` to match gamesProcessor:
- Added: `aws-wsgi`, `flask-restful`, `pymongo`, `flask-jwt-extended`
- Removed: `mangum` (replaced with aws-wsgi)

### 7. **Error Handling**
- Consistent error responses with `{'success': False, 'error': 'message'}`
- Proper HTTP status codes
- Centralized error handling in services

### 8. **Security**
- JWT token-based authentication
- CORS headers in after_request handler
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)

## Usage

### **Running Locally**
```bash
cd amplify/backend/function/connecoback/src
ENV=local python index.py
```

### **Testing Structure**
```bash
cd amplify/backend/function/connecoback
python test_structure.py
```

### **Lambda Deployment**
The `handler` function in `index.py` is ready for AWS Lambda deployment with API Gateway.

## Migration Notes

1. **Database**: Update connection strings in config files
2. **Environment Variables**: Set `ENV` variable for environment selection
3. **JWT Secrets**: Update JWT secrets in production config
4. **Dependencies**: Install new requirements.txt

## Benefits

1. **Scalability**: Easy to add new services and endpoints
2. **Maintainability**: Clear separation of concerns
3. **Consistency**: Matches established patterns from gamesProcessor
4. **Configuration**: Environment-based configuration management
5. **Testing**: Easier to test individual components
6. **Documentation**: Clear structure and naming conventions
