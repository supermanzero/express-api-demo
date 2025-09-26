# My Express API

A production-ready Express.js API with authentication, user management, and comprehensive testing.

## Features

- 🔐 JWT Authentication
- 👥 User Management (CRUD)
- 🛡️ Role-based Authorization
- ✅ Input Validation
- 🚀 Rate Limiting
- 📊 Health Check Endpoints
- 🧪 Comprehensive Testing
- 🔒 Security Middleware
- 📝 Request Logging

## Quick Start

### Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Run tests:
```bash
npm test
```

### Production

1. Install dependencies:
```bash
npm install --production
```

2. Start with PM2:
```bash
pm2 start ecosystem.config.js --env production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Health
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health check

## Default Users

### Admin User
- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`

### Regular User
- Email: `user@example.com`
- Password: `admin123`
- Role: `user`

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

## Authentication

All protected routes require a Bearer token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

Get a token by logging in via the `/api/auth/login` endpoint.

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Production Deployment

This API is designed to work with the provided deployment script. The script will:

1. Install Node.js and dependencies
2. Start the API using PM2 process manager
3. Configure the service to restart on system reboot

Make sure to:
- Update the JWT_SECRET in production
- Configure a proper database (currently using in-memory storage)
- Set up proper logging and monitoring
- Configure HTTPS with a reverse proxy like nginx

## Security Features

- Helmet.js for security headers
- CORS protection
- Rate limiting (100 requests per 15 minutes per IP)
- JWT token authentication
- Password hashing with bcrypt
- Input validation with Joi
- Role-based access control

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "details": ["Detailed error messages"]
}
```