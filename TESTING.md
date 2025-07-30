# Testing Documentation

This document provides information about running tests for both the backend and frontend of the SkillSwap application.

## Backend Testing (NestJS)

### Prerequisites
- Node.js and npm installed
- MongoDB running (for integration tests)

### Running Backend Tests

1. **Unit Tests**
   ```bash
   cd api.js
   npm test
   ```

2. **Unit Tests with Coverage**
   ```bash
   cd api.js
   npm run test:cov
   ```

3. **Unit Tests in Watch Mode**
   ```bash
   cd api.js
   npm run test:watch
   ```

4. **E2E Tests**
   ```bash
   cd api.js
   npm run test:e2e
   ```

### Backend Test Structure

The backend tests are organized as follows:

```
api.js/
├── src/
│   ├── Modules/
│   │   ├── user/
│   │   │   ├── user.service.spec.ts      # User service tests
│   │   │   └── user.controller.spec.ts   # User controller tests
│   │   └── auth/
│   │       └── auth.service.spec.ts      # Auth service tests
│   └── test/
│       └── app.e2e-spec.ts              # E2E tests
```

### Backend Test Coverage

The backend tests cover:

- **User Service**: All CRUD operations, search, and statistics
- **Auth Service**: Login, register, and user validation
- **User Controller**: All HTTP endpoints and error handling
- **Repository Layer**: Database operations and queries

## Frontend Testing (React + Vitest)

### Prerequisites
- Node.js and npm installed
- All frontend dependencies installed

## Configuration

### Backend (Jest)
- **Location**: `api.js/`
- **Config**: Jest configuration in `package.json` with path mapping for `src/*` imports
- **Test Files**: `*.spec.ts` files alongside source files
- **Coverage**: HTML report in `coverage/` directory
- **Module Resolution**: Configured to handle TypeScript path aliases

### Frontend (Vitest)
- **Location**: `web/`
- **Config**: `vitest.config.ts`
- **Test Files**: `*.test.tsx` files alongside components
- **Coverage**: HTML report in `coverage/` directory

### Running Frontend Tests

1. **Unit Tests**
   ```bash
   cd web
   npm test
   ```

2. **Unit Tests with UI**
   ```bash
   cd web
   npm run test:ui
   ```

3. **Unit Tests with Coverage**
   ```bash
   cd web
   npm run test:coverage
   ```

### Frontend Test Structure

The frontend tests are organized as follows:

```
web/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── UserProfileModal.test.tsx    # Modal component tests
│   │   └── dashboard/
│   │       └── Header.test.tsx              # Header component tests
│   ├── hooks/
│   │   └── useGetUserStats.test.ts          # Custom hook tests
│   └── test/
│       └── setup.ts                         # Test configuration
├── vitest.config.ts                         # Vitest configuration
└── package.json                             # Test scripts and dependencies
```

### Frontend Test Coverage

The frontend tests cover:

- **Components**: UserProfileModal, Header, and other UI components
- **Custom Hooks**: useGetUserStats and other custom hooks
- **User Interactions**: Click events, form submissions, modal interactions
- **Error Handling**: API errors, loading states, edge cases
- **Accessibility**: ARIA labels, keyboard navigation

## Test Configuration

### Backend (Jest)

The backend uses Jest with the following configuration:

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

### Frontend (Vitest)

The frontend uses Vitest with the following configuration:

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Mocking Strategy

### Backend Mocks

- **Repository Layer**: Mocked using Jest mocks
- **External Services**: Cloudinary, StreamChat, and other external APIs
- **Database**: MongoDB operations mocked at repository level

### Frontend Mocks

- **API Calls**: Axios requests mocked using Vitest
- **Local Storage**: Browser storage mocked for testing
- **External Libraries**: React Query, StreamChat, and other libraries
- **Browser APIs**: IntersectionObserver, ResizeObserver, matchMedia

## Writing New Tests

### Backend Test Example

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a new user', async () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const expectedUser = {
      _id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
    };

    mockUsersRepository.create.mockResolvedValue(expectedUser);

    const result = await service.create(createUserDto);

    expect(repository.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(expectedUser);
  });
});
```

### Frontend Test Example

```typescript
describe('UserProfileModal', () => {
  const mockUser: User = {
    _id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
    skills: [],
  };

  it('should render user profile when open', () => {
    render(
      <UserProfileModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## Best Practices

### Backend Testing

1. **Isolation**: Each test should be independent
2. **Mocking**: Mock external dependencies
3. **Coverage**: Aim for high test coverage (>80%)
4. **Naming**: Use descriptive test names
5. **Structure**: Arrange-Act-Assert pattern

### Frontend Testing

1. **User-Centric**: Test from user perspective
2. **Accessibility**: Include accessibility tests
3. **Integration**: Test component interactions
4. **Error States**: Test error handling
5. **Loading States**: Test loading scenarios

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd api.js && npm ci
      - run: cd api.js && npm test
      - run: cd api.js && npm run test:cov

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd web && npm ci
      - run: cd web && npm test
      - run: cd web && npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**
   - **Error**: `Cannot find module 'src/config/configuration'`
   - **Solution**: Use relative imports instead of absolute paths
   - **Example**: Change `import configuration from 'src/config/configuration'` to `import configuration from '../../config/configuration'`

2. **Backend Tests Failing**
   - Check MongoDB connection
   - Verify all dependencies are installed
   - Clear Jest cache: `npm run test -- --clearCache`

3. **Frontend Tests Failing**
   - Check Node.js version compatibility
   - Clear Vitest cache: `npm run test -- --clearCache`
   - Verify all dependencies are installed

4. **Mock Issues**
   - Ensure mocks are properly configured
   - Check import/export statements
   - Verify mock function signatures

### Debugging

1. **Backend Debug Mode**
   ```bash
   npm run test:debug
   ```

2. **Frontend Debug Mode**
   ```bash
   npm run test:ui
   ```

## Coverage Reports

### Backend Coverage
- Run `npm run test:cov` in the `api.js` directory
- Coverage report will be generated in `coverage/` directory

### Frontend Coverage
- Run `npm run test:coverage` in the `web` directory
- Coverage report will be displayed in the terminal

## Performance Testing

### Backend Performance
- Use Jest's built-in performance testing
- Monitor memory usage and execution time
- Test with large datasets

### Frontend Performance
- Use React DevTools Profiler
- Test component re-renders
- Monitor bundle size impact

## Security Testing

### Backend Security
- Test authentication and authorization
- Validate input sanitization
- Test rate limiting and CORS

### Frontend Security
- Test XSS prevention
- Validate form inputs
- Test secure storage practices 