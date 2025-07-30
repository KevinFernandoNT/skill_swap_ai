# SkillSwap Application - Comprehensive Test Plan

## Table of Contents
1. [Overview](#overview)
2. [Test Environment Setup](#test-environment-setup)
3. [Backend Testing (NestJS)](#backend-testing-nestjs)
4. [Frontend Testing (React)](#frontend-testing-react)
5. [Python API Testing](#python-api-testing)
6. [Integration Testing](#integration-testing)
7. [End-to-End Testing](#end-to-end-testing)
8. [Performance Testing](#performance-testing)
9. [Security Testing](#security-testing)
10. [Test Data Management](#test-data-management)
11. [Test Execution Strategy](#test-execution-strategy)
12. [Reporting and Monitoring](#reporting-and-monitoring)

## Overview

The SkillSwap application consists of three main components:
- **Backend (NestJS)**: REST API with MongoDB database
- **Frontend (React)**: User interface with TypeScript and Vite
- **Python API**: AI/ML services for keyword matching and LLM integration

### Application Architecture
- **Authentication**: JWT-based with Passport.js
- **Database**: MongoDB with Mongoose ODM
- **File Storage**: Cloudinary for avatar uploads
- **Real-time Chat**: Stream Chat integration
- **AI Services**: Pinecone vector database, LangChain, HuggingFace models

## Test Environment Setup

### Prerequisites
```bash
# Backend
cd api.js
npm install
npm run build

# Frontend
cd web
npm install

# Python API
cd api.py
pip install -r requirements.txt
```

### Environment Configuration
```bash
# Backend (.env.development)
MONGODB_URI=mongodb://localhost:27017/skillswap_test
JWT_SECRET=test_secret_key
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=test_cloud
CLOUDINARY_API_KEY=test_key
CLOUDINARY_API_SECRET=test_secret
STREAM_CHAT_API_KEY=test_stream_key
STREAM_CHAT_API_SECRET=test_stream_secret

# Python API (.env)
PINECONE_API_KEY=test_pinecone_key
PINECONE_ENVIRONMENT=test_env
HUGGINGFACE_API_KEY=test_hf_key
```

## Backend Testing (NestJS)

### Unit Testing Strategy

#### 1. Service Layer Tests
**Files to Test:**
- `api.js/src/Modules/user/user.service.spec.ts`
- `api.js/src/Modules/auth/auth.service.spec.ts`
- `api.js/src/Modules/sessions/sessions.service.spec.ts`
- `api.js/src/Modules/skills/skills.service.spec.ts`
- `api.js/src/Modules/messages/messages.service.spec.ts`
- `api.js/src/Modules/exchange-requests/exchange-requests.service.spec.ts`
- `api.js/src/Modules/exchange-sessions/exchange-sessions.service.spec.ts`

**Test Cases:**
```typescript
// Example: User Service Tests
describe('UsersService', () => {
  describe('create', () => {
    it('should create a new user successfully');
    it('should throw error for duplicate email');
    it('should hash password before saving');
  });

  describe('findById', () => {
    it('should return user by ID');
    it('should return null for non-existent user');
  });

  describe('update', () => {
    it('should update user successfully');
    it('should throw error for non-existent user');
  });

  describe('getUserStats', () => {
    it('should return user statistics');
    it('should calculate session statistics correctly');
  });
});
```

#### 2. Controller Layer Tests
**Files to Test:**
- `api.js/src/Modules/user/user.controller.spec.ts`
- `api.js/src/Modules/auth/auth.controller.spec.ts`
- `api.js/src/Modules/sessions/sessions.controller.spec.ts`
- `api.js/src/Modules/skills/skills.controller.spec.ts`

**Test Cases:**
```typescript
// Example: Auth Controller Tests
describe('AuthController', () => {
  describe('POST /auth/register', () => {
    it('should register new user successfully');
    it('should return 400 for invalid data');
    it('should return 409 for duplicate email');
    it('should upload avatar successfully');
  });

  describe('POST /auth/login', () => {
    it('should login user successfully');
    it('should return 401 for invalid credentials');
    it('should generate JWT token');
  });
});
```

#### 3. Repository Layer Tests
**Files to Test:**
- `api.js/src/Modules/user/users.repository.spec.ts`
- `api.js/src/Modules/sessions/sessions.repository.spec.ts`
- `api.js/src/Modules/skills/skills.repository.spec.ts`

**Test Cases:**
```typescript
// Example: User Repository Tests
describe('UsersRepository', () => {
  describe('findByEmail', () => {
    it('should find user by email');
    it('should return null for non-existent email');
  });

  describe('getUserSessionStats', () => {
    it('should calculate total sessions correctly');
    it('should calculate completed sessions correctly');
    it('should calculate hosted sessions correctly');
    it('should calculate participated sessions correctly');
  });
});
```

#### 4. Integration Tests
**Files to Test:**
- `api.js/test/app.e2e-spec.ts`

**Test Cases:**
```typescript
describe('AppController (e2e)', () => {
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
```

### API Endpoint Testing

#### Authentication Endpoints
```typescript
describe('Authentication API', () => {
  describe('POST /auth/register', () => {
    it('should register user with valid data');
    it('should handle avatar upload');
    it('should validate required fields');
    it('should check email uniqueness');
  });

  describe('POST /auth/login', () => {
    it('should authenticate valid credentials');
    it('should return JWT token');
    it('should handle invalid credentials');
  });
});
```

#### User Management Endpoints
```typescript
describe('User API', () => {
  describe('GET /users', () => {
    it('should return paginated users');
    it('should apply search filters');
  });

  describe('GET /users/:id', () => {
    it('should return user by ID');
    it('should return 404 for non-existent user');
  });

  describe('GET /users/:id/stats', () => {
    it('should return user statistics');
    it('should include session counts');
    it('should include rating information');
  });

  describe('PUT /users/profile', () => {
    it('should update user profile');
    it('should handle avatar upload');
    it('should validate input data');
  });

  describe('PUT /users/change-password', () => {
    it('should change password successfully');
    it('should validate current password');
    it('should hash new password');
  });
});
```

#### Skills Management Endpoints
```typescript
describe('Skills API', () => {
  describe('POST /skills', () => {
    it('should create skill successfully');
    it('should validate required fields');
    it('should handle metadata generation');
  });

  describe('GET /skills', () => {
    it('should return user skills');
    it('should filter by type (teaching/learning)');
  });

  describe('GET /skills/suggested-users', () => {
    it('should return suggested users based on skills');
    it('should call Python API for keyword matching');
    it('should categorize matches correctly');
  });
});
```

#### Sessions Management Endpoints
```typescript
describe('Sessions API', () => {
  describe('POST /sessions', () => {
    it('should create session successfully');
    it('should trigger background process');
    it('should validate session data');
  });

  describe('GET /sessions', () => {
    it('should return user sessions');
    it('should apply pagination');
    it('should filter by status');
  });

  describe('GET /sessions/suggested', () => {
    it('should return suggested sessions');
    it('should match user skills');
    it('should exclude user\'s own sessions');
  });

  describe('POST /sessions/:id/join', () => {
    it('should join session successfully');
    it('should check session capacity');
    it('should prevent joining own session');
  });
});
```

## Frontend Testing (React)

### Component Testing Strategy

#### 1. Core Components
**Files to Test:**
- `web/src/components/ui/UserProfileModal.test.tsx`
- `web/src/components/forms/LoginForm.test.tsx`
- `web/src/components/forms/SignupForm.test.tsx`
- `web/src/components/sessions/CreateSessionModal.test.tsx`
- `web/src/components/skills/SkillsPage.test.tsx`

**Test Cases:**
```typescript
// Example: UserProfileModal Tests
describe('UserProfileModal', () => {
  it('should display user information correctly');
  it('should show skills separated by type');
  it('should display user statistics');
  it('should handle loading states');
  it('should handle error states');
});
```

#### 2. Custom Hooks Testing
**Files to Test:**
- `web/src/hooks/useGetUserStats.test.tsx`
- `web/src/hooks/useAuth.test.tsx`
- `web/src/hooks/useCreateSession.test.tsx`

**Test Cases:**
```typescript
// Example: useGetUserStats Tests
describe('useGetUserStats', () => {
  it('should fetch user stats successfully');
  it('should handle loading state');
  it('should handle error state');
  it('should not fetch when userId is null');
});
```

#### 3. Page Components Testing
**Files to Test:**
- `web/src/pages/Dashboard.test.tsx`
- `web/src/pages/Login.test.tsx`
- `web/src/pages/Signup.test.tsx`

**Test Cases:**
```typescript
// Example: Dashboard Tests
describe('Dashboard', () => {
  it('should render dashboard components');
  it('should display user information');
  it('should show suggested connections');
  it('should display upcoming sessions');
  it('should handle navigation');
});
```

### User Interface Testing

#### Form Validation Testing
```typescript
describe('Form Validation', () => {
  describe('Login Form', () => {
    it('should validate email format');
    it('should require password');
    it('should show error messages');
    it('should handle successful login');
  });

  describe('Signup Form', () => {
    it('should validate all required fields');
    it('should validate password strength');
    it('should validate email format');
    it('should handle avatar upload');
  });

  describe('Create Session Form', () => {
    it('should validate session details');
    it('should require skill selection');
    it('should validate date and time');
    it('should handle form submission');
  });
});
```

#### Component Interaction Testing
```typescript
describe('Component Interactions', () => {
  describe('User Profile Modal', () => {
    it('should open when user card is clicked');
    it('should display correct user information');
    it('should show skills in correct sections');
    it('should handle close action');
  });

  describe('Session Management', () => {
    it('should create session successfully');
    it('should edit session details');
    it('should delete session with confirmation');
    it('should join/leave sessions');
  });
});
```

## Python API Testing

### Unit Testing Strategy

#### 1. Core Functions Testing
**Files to Test:**
- `api.py/src/llm/llm.py`
- `api.py/src/_pinecone/retreiver.py`
- `api.py/src/hf/hf_client.py`

**Test Cases:**
```python
# Example: LLM Tests
class TestLLM:
    def test_generate_response(self):
        """Test response generation with valid input"""
        pass

    def test_generate_response_invalid_input(self):
        """Test response generation with invalid input"""
        pass

    def test_response_format(self):
        """Test response format and structure"""
        pass
```

#### 2. API Endpoint Testing
**Files to Test:**
- `api.py/src/routes/agent.py`
- `api.py/src/routes/llm.py`

**Test Cases:**
```python
# Example: Agent Routes Tests
class TestAgentRoutes:
    def test_search_keywords_valid(self):
        """Test keyword search with valid input"""
        pass

    def test_search_keywords_invalid(self):
        """Test keyword search with invalid input"""
        pass

    def test_search_keywords_direct(self):
        """Test direct keyword search"""
        pass

    def test_error_handling(self):
        """Test error handling for various scenarios"""
        pass
```

#### 3. Integration Testing
```python
class TestPineconeIntegration:
    def test_upsert_text_to_pinecone(self):
        """Test text insertion to Pinecone"""
        pass

    def test_query_keywords_from_pinecone(self):
        """Test keyword querying from Pinecone"""
        pass

    def test_search_keywords(self):
        """Test keyword search functionality"""
        pass
```

## Integration Testing

### Backend-Frontend Integration
```typescript
describe('API Integration', () => {
  describe('Authentication Flow', () => {
    it('should register user and redirect to dashboard');
    it('should login user and maintain session');
    it('should handle authentication errors');
  });

  describe('Data Flow', () => {
    it('should fetch and display user data');
    it('should create and display sessions');
    it('should update user profile');
    it('should handle real-time updates');
  });
});
```

### Backend-Python API Integration
```typescript
describe('Python API Integration', () => {
  describe('Keyword Matching', () => {
    it('should send keywords to Python API');
    it('should receive matching results');
    it('should handle API errors gracefully');
  });

  describe('Session Metadata', () => {
    it('should generate metadata for sessions');
    it('should update session with metadata');
    it('should handle background processing');
  });
});
```

## End-to-End Testing

### User Journey Testing
```typescript
describe('User Journey', () => {
  describe('New User Registration', () => {
    it('should complete registration flow');
    it('should add initial skills');
    it('should see suggested connections');
    it('should create first session');
  });

  describe('Skill Exchange Flow', () => {
    it('should find matching users');
    it('should create exchange request');
    it('should accept/reject requests');
    it('should schedule exchange session');
  });

  describe('Session Management', () => {
    it('should create teaching session');
    it('should join learning session');
    it('should complete session');
    it('should update session status');
  });
});
```

## Performance Testing

### Load Testing
```bash
# Backend API Load Testing
npm run test:load

# Test Scenarios:
# - 100 concurrent users
# - 1000 requests per minute
# - Database query performance
# - File upload performance
```

### Memory and CPU Testing
```bash
# Monitor resource usage
npm run test:performance

# Test Scenarios:
# - Memory leaks in React components
# - CPU usage during heavy operations
# - Database connection pooling
# - File upload memory usage
```

## Security Testing

### Authentication Testing
```typescript
describe('Security', () => {
  describe('JWT Token', () => {
    it('should validate token format');
    it('should handle expired tokens');
    it('should prevent token tampering');
  });

  describe('Password Security', () => {
    it('should hash passwords properly');
    it('should validate password strength');
    it('should prevent password exposure');
  });

  describe('Authorization', () => {
    it('should protect private endpoints');
    it('should validate user permissions');
    it('should prevent unauthorized access');
  });
});
```

### Input Validation Testing
```typescript
describe('Input Validation', () => {
  describe('SQL Injection Prevention', () => {
    it('should sanitize user inputs');
    it('should prevent malicious queries');
  });

  describe('XSS Prevention', () => {
    it('should sanitize HTML inputs');
    it('should prevent script injection');
  });

  describe('File Upload Security', () => {
    it('should validate file types');
    it('should prevent malicious uploads');
    it('should limit file sizes');
  });
});
```

## Test Data Management

### Test Data Setup
```typescript
// Test data factories
const createTestUser = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  ...overrides
});

const createTestSkill = (overrides = {}) => ({
  name: 'JavaScript',
  category: 'Programming',
  proficiency: 80,
  type: 'teaching',
  ...overrides
});

const createTestSession = (overrides = {}) => ({
  title: 'Learn JavaScript',
  description: 'Introduction to JavaScript',
  date: '2024-01-15',
  startTime: '10:00',
  endTime: '11:00',
  ...overrides
});
```

### Database Seeding
```typescript
// Seed test database
describe('Database Setup', () => {
  beforeAll(async () => {
    await seedTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });
});
```

## Test Execution Strategy

### Test Categories
1. **Unit Tests**: Fast, isolated tests for individual functions
2. **Integration Tests**: Tests for component interactions
3. **E2E Tests**: Full user journey tests
4. **Performance Tests**: Load and stress testing
5. **Security Tests**: Authentication and authorization testing

### Test Execution Order
```bash
# 1. Unit Tests (Fastest)
npm run test:unit

# 2. Integration Tests
npm run test:integration

# 3. E2E Tests
npm run test:e2e

# 4. Performance Tests
npm run test:performance

# 5. Security Tests
npm run test:security
```

### Continuous Integration
```yaml
# GitHub Actions Example
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Run E2E tests
        run: npm run test:e2e
```

## Reporting and Monitoring

### Test Coverage Reporting
```bash
# Generate coverage reports
npm run test:coverage

# Coverage targets:
# - Backend: 80% minimum
# - Frontend: 70% minimum
# - Python API: 75% minimum
```

### Test Results Dashboard
```typescript
// Test metrics tracking
interface TestMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  coverage: number;
  executionTime: number;
}
```

### Performance Monitoring
```typescript
// Performance metrics
interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
}
```

## Conclusion

This comprehensive test plan ensures:
- **Reliability**: All critical functionality is tested
- **Performance**: System handles expected load
- **Security**: Vulnerabilities are identified and prevented
- **Maintainability**: Tests are well-organized and documented
- **Scalability**: Test suite grows with the application

The test plan should be updated as new features are added and existing functionality is modified. 