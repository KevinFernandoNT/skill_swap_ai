# SkillSwap - Peer-to-Peer Skill Exchange Platform

SkillSwap is a comprehensive platform that enables users to exchange skills through structured learning sessions. The platform consists of three main components: a Node.js backend API, a Python AI service, and a React frontend.

## 🏗️ Project Architecture

```
SkillSwap/
├── api.js/          # Node.js Backend API (NestJS)
├── api.py/          # Python AI Service (FastAPI)
└── web/             # React Frontend (Vite + TypeScript)
```

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn** or **bun**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SkillSwap
```

### 2. Environment Setup

Create environment files for each component:

#### Backend API (api.js)
```bash
cd api.js
cp .env.example .env
```

Edit `.env` file:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/skillswap

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Python API
PYTHON_API_URL=http://localhost:8000

# Cloudinary (for avatar uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Python API (api.py)
```bash
cd api.py
cp .env.example .env
```

Edit `.env` file:
```env
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# External APIs (if needed)
OPENAI_API_KEY=your-openai-key
PINECONE_API_KEY=your-pinecone-key
```

#### Frontend (web)
```bash
cd web
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_PYTHON_API_URL=http://localhost:8000
```

### 3. Install Dependencies

#### Backend API
```bash
cd api.js
npm install
# or
yarn install
# or
bun install
```

#### Python API
```bash
cd api.py
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

#### Frontend
```bash
cd web
npm install
# or
yarn install
# or
bun install
```

### 4. Database Setup

Start MongoDB:
```bash
# Start MongoDB service
mongod

# Or if using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Run the Applications

#### Start Python AI Service (Terminal 1)
```bash
cd api.py
source venv/bin/activate  # On Windows: venv\Scripts\activate
python src/main.py
```
The Python API will be available at: http://localhost:8000

#### Start Node.js Backend API (Terminal 2)
```bash
cd api.js
npm run start:dev
# or
yarn start:dev
# or
bun run start:dev
```
The backend API will be available at: http://localhost:3000

#### Start React Frontend (Terminal 3)
```bash
cd web
npm run dev
# or
yarn dev
# or
bun dev
```
The frontend will be available at: http://localhost:5173

## 📚 API Documentation

### Backend API (Node.js)
- **Base URL**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

### Python AI Service
- **Base URL**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🔧 Development Commands

### Backend API (api.js)
```bash
# Development mode
npm run start:dev

# Build
npm run build

# Production mode
npm run start:prod

# Run tests
npm run test
npm run test:e2e

# Run migrations
npm run migration:run
```

### Python API (api.py)
```bash
# Development mode
python src/main.py

# Run tests
python -m pytest tests/

# Install new dependencies
pip install package-name
pip freeze > requirements.txt
```

### Frontend (web)
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

## 🗄️ Database Migrations

The backend includes sample data migrations:

```bash
cd api.js
npm run migration:run
```

This will populate the database with:
- Sample users
- Sample skills
- Sample sessions
- Sample exchange requests

## 🔐 Authentication

The platform uses JWT-based authentication. To get started:

1. Register a new user through the frontend
2. Login to receive a JWT token
3. The token is automatically stored and used for API requests

## 📁 Project Structure

### Backend API (api.js)
```
src/
├── Modules/
│   ├── auth/           # Authentication
│   ├── user/           # User management
│   ├── skills/         # Skills management
│   ├── sessions/       # Session management
│   ├── exchange-requests/    # Exchange requests
│   ├── exchange-sessions/    # Exchange sessions
│   ├── messages/       # Messaging
│   ├── notifications/  # Notifications
│   └── common/         # Shared utilities
├── config/             # Configuration
└── main.ts            # Application entry point
```

### Python API (api.py)
```
src/
├── routes/             # API routes
├── llm/               # Language model integration
├── hf/                # Hugging Face integration
├── _pinecone/         # Pinecone vector database
└── main.py           # Application entry point
```

### Frontend (web)
```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── types/             # TypeScript types
├── lib/               # Utility libraries
└── main.tsx          # Application entry point
```

## 🧪 Testing

### Backend Tests
```bash
cd api.js
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### Frontend Tests
```bash
cd web
npm run test          # Unit tests
npm run test:ui       # UI tests
```

## 🚀 Deployment

### Backend API
```bash
cd api.js
npm run build
npm run start:prod
```

### Python API
```bash
cd api.py
pip install -r requirements.txt
python src/main.py
```

### Frontend
```bash
cd web
npm run build
# Serve the dist/ folder with a web server
```

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`

2. **Python Dependencies**
   - Make sure virtual environment is activated
   - Reinstall requirements: `pip install -r requirements.txt`

3. **Node.js Dependencies**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

4. **Port Conflicts**
   - Check if ports 3000, 8000, or 5173 are already in use
   - Change ports in respective `.env` files

### Logs

- **Backend API**: Check console output for detailed logs
- **Python API**: Logs are printed to console
- **Frontend**: Check browser console for errors

## 📝 Environment Variables Reference

### Backend API (.env)
```env
# Required
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your-secret-key
PORT=3000

# Optional
NODE_ENV=development
PYTHON_API_URL=http://localhost:8000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Python API (.env)
```env
# Required
HOST=0.0.0.0
PORT=8000

# Optional
DEBUG=True
OPENAI_API_KEY=your-openai-key
PINECONE_API_KEY=your-pinecone-key
```

### Frontend (.env)
```env
# Required
VITE_API_URL=http://localhost:3000
VITE_PYTHON_API_URL=http://localhost:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation at the respective endpoints

---

**Happy Skill Swapping! 🚀**
