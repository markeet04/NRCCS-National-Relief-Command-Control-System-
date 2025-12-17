# 🚨 NRCCS - National Relief Command & Control System

A comprehensive disaster management and relief coordination platform for Pakistan's national, provincial, and district-level authorities.

## 🎯 Project Overview

NRCCS is a full-stack web application designed to coordinate disaster relief efforts across multiple administrative levels:

- **SuperAdmin**: System administration and configuration
- **NDMA**: National Disaster Management Authority coordination
- **PDMA**: Provincial Disaster Management Authority operations
- **District**: District-level emergency response
- **Civilian**: Public SOS requests and information

## 🏗️ Architecture

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL (Neon)
- **ORM**: TypeORM
- **Authentication**: JWT + Session-based
- **Validation**: class-validator
- **Security**: bcrypt password hashing, role-based access control

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Custom components
- **State**: Context API
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Database
- **Provider**: Neon (Serverless PostgreSQL)
- **Schema Version**: v2.2 (Production-Ready)
- **Tables**: 25 tables with full relationships
- **Features**: Soft delete, audit logging, session management

## 📦 Project Structure

```
NRCCS/
├── backend/
│   └── nrccs/
│       ├── src/
│       │   ├── auth/              # Authentication module
│       │   ├── superadmin/        # SuperAdmin module
│       │   ├── common/            # Shared entities, guards, decorators
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── schema_v2.2_PRODUCTION_READY.sql
│       ├── package.json
│       └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── landing/       # Landing page & login
│   │   │   ├── superadmin/    # SuperAdmin dashboard
│   │   │   ├── ndma/          # NDMA dashboard
│   │   │   ├── pdma/          # PDMA dashboard
│   │   │   ├── district/      # District dashboard
│   │   │   └── civilian/      # Civilian portal
│   │   ├── shared/            # Shared components & services
│   │   ├── app/               # App-level config (router, providers)
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
├── SUPERADMIN_IMPLEMENTATION.md  # Complete implementation docs
├── QUICKSTART.md                  # Quick start guide
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- npm or yarn

### 1. Setup Database
```bash
# Run schema
psql "$DATABASE_URL" -f backend/nrccs/schema_v2.2_PRODUCTION_READY.sql

# Generate demo users
cd backend/nrccs
npm run seed:generate
# Run the output SQL in your database
```

### 2. Setup Backend
```bash
cd backend/nrccs
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npm install
npm run start:dev
```

### 3. Setup Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env with VITE_API_URL (default: http://localhost:3000/api)
npm install
npm run dev
```

### 4. Login
- Open `http://localhost:5173`
- Click "Internal Staff Login"
- Use demo credentials (see below)

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **SuperAdmin** | admin@nrccs.gov.pk | password123 |
| NDMA | ndma@nrccs.gov.pk | password123 |
| PDMA | pdma.punjab@nrccs.gov.pk | password123 |
| District | district.lahore@nrccs.gov.pk | password123 |
| Civilian | citizen@example.com | password123 |

## 📡 API Documentation

### Authentication
```
POST   /api/auth/login       # Login
POST   /api/auth/logout      # Logout
POST   /api/auth/validate    # Validate session
```

### SuperAdmin (Protected)
```
GET    /api/superadmin/users              # Get all users
POST   /api/superadmin/users              # Create user
PUT    /api/superadmin/users/:id          # Update user
DELETE /api/superadmin/users/:id          # Delete user
GET    /api/superadmin/settings           # Get settings
PUT    /api/superadmin/settings           # Update settings
GET    /api/superadmin/audit-logs         # Get audit logs
GET    /api/superadmin/stats              # Get statistics
```

See [SUPERADMIN_IMPLEMENTATION.md](./SUPERADMIN_IMPLEMENTATION.md) for complete API documentation.

## 🛠️ Development

### Backend Development
```bash
cd backend/nrccs
npm run start:dev    # Start with hot-reload
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
```

## 📊 Database Schema

### Key Tables
- `users` - User accounts with roles (superadmin, ndma, pdma, district, civilian)
- `user_sessions` - Session management
- `sos_requests` - Emergency SOS requests
- `shelters` - Shelter information
- `rescue_teams` - Rescue team management
- `damage_reports` - Damage assessments
- `alerts` - Emergency alerts
- `resources` - Resource tracking
- `missing_persons` - Missing person reports
- `audit_logs` - System audit trail
- `activity_logs` - User activity tracking

See [schema_v2.2_PRODUCTION_READY.sql](./backend/nrccs/schema_v2.2_PRODUCTION_READY.sql) for complete schema.

## 🔒 Security Features

- ✅ bcrypt password hashing
- ✅ JWT + Session-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Route guards on frontend and backend
- ✅ CORS protection
- ✅ Input validation
- ✅ Audit logging
- ✅ Soft delete for data recovery

## 📈 Implementation Status

### ✅ Completed
- SuperAdmin Module (100%)
  - User management
  - System settings
  - API integrations
  - Audit logs
  - Statistics
- Authentication & Authorization (100%)
- Database Schema (100%)
- Frontend Integration (100%)

### 🚧 In Progress
- NDMA Module
- PDMA Module
- District Module
- Civilian Module

## 📚 Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get started in 5 minutes
- [SuperAdmin Implementation](./SUPERADMIN_IMPLEMENTATION.md) - Complete technical documentation
- [Frontend Schema Compatibility](./backend/nrccs/FRONTEND_SCHEMA_COMPATIBILITY_REPORT.md) - Frontend-backend alignment
- [Database Quick Reference](./backend/nrccs/QUICK_REFERENCE.md) - Database queries and patterns

## 🧪 Testing

### Test Backend API
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nrccs.gov.pk","password":"password123"}'

# Get users (use token from login)
curl http://localhost:3000/api/superadmin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Frontend
1. Login with different roles
2. Verify role-based access (SuperAdmin can't access NDMA routes, etc.)
3. Test CRUD operations in SuperAdmin panel
4. Verify logout functionality

## 🚀 Deployment

### Backend (Production)
```bash
cd backend/nrccs
npm run build
npm run start:prod
```

### Frontend (Production)
```bash
cd frontend
npm run build
# Deploy 'dist' folder to your hosting (Vercel, Netlify, etc.)
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-min-32-chars
PORT=3000
FRONTEND_URL=https://your-frontend-domain.com
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 🤝 Contributing

1. Create feature branch
2. Follow existing code patterns
3. Test thoroughly
4. Submit pull request

## 📝 License

[Add your license here]

## 👥 Team

NRCCS Development Team

## 📞 Support

For issues or questions:
1. Check [QUICKSTART.md](./QUICKSTART.md)
2. Check [SUPERADMIN_IMPLEMENTATION.md](./SUPERADMIN_IMPLEMENTATION.md)
3. Review database schema
4. Contact development team

---

**Status**: ✅ SuperAdmin Module Production-Ready  
**Last Updated**: December 16, 2025  
**Version**: 1.0.0
