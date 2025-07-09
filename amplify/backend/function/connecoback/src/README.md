# Conneco Backend - Flask API

This is the backend API for the Conneco application, built with Flask, Flask-RESTful, Flask-JWT-Extended, and Flask-CORS.

## 🏗️ Architecture

The project has been rewritten to use:

- **Flask** - Web framework
- **Flask-RESTful** - RESTful API extension
- **Flask-JWT-Extended** - JWT authentication
- **Flask-CORS** - Cross-origin resource sharing
- **Mangum** - ASGI adapter for AWS Lambda

## 📁 Project Structure

```
src/
├── config/          # Configuration and environment setup
│   └── env.py       # Environment variables validation
├── routes/          # Flask-RESTful resources
│   ├── auth_routes.py # Authentication endpoints
│   └── post_routes.py # Post endpoints
├── services/        # Database service layer
│   └── database/    # Database implementations
├── types/           # Type definitions
├── utils/           # Utility functions
├── constants/       # Application constants
└── index.py         # Flask application entry point
```

## 🚀 API Endpoints

### Authentication
- `POST /server/auth/login` - User login
- `POST /server/auth/signup` - User signup
- `POST /server/auth/refresh` - Refresh access token

### Posts
- `POST /server/posts/create` - Create a new post (requires auth)
- `GET /server/posts/user` - Get current user's posts (requires auth)
- `POST /server/posts/search` - Search posts by user names (requires auth)

## 🔧 Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export MONGODB_URI="mongodb://localhost:27017/conneco"
export JWT_SECRET="your-secret-key"
export ADMIN_PASSWORD="admin123"
```

3. Run the application:
```bash
python -m src.index
```

## 🏃‍♂️ Running with AWS Lambda

The application uses Mangum to provide ASGI compatibility for AWS Lambda. The `lambda_handler` function in `index.py` handles Lambda events.

## 🧪 Testing

Run the test script to verify the application works:
```bash
python test_app.py
```

## 📝 Key Features

- ✅ JWT-based authentication
- ✅ RESTful API design
- ✅ CORS enabled
- ✅ MongoDB database support
- ✅ Lambda-compatible
- ✅ Structured error handling
- ✅ Request/response logging
- ✅ Type safety with TypedDict
