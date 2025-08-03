# SkillSwap Application - Comprehensive Test Cases

**Document Version:** 1.0  
**Date:** January 2025  
**Project:** SkillSwap - Skill Exchange Platform  

---

## Backend Test Cases (NestJS API)

### Authentication Module

#### **TC-BE-AUTH-001**
- **Test Case ID:** TC-BE-AUTH-001
- **Test Case Name:** User Registration with Valid Data
- **Purpose/Objective:** Verify that a new user can be registered successfully with valid information
- **Pre-conditions:** 
  - Backend server is running
  - Database connection is established
  - Email service is configured
- **Test Steps:**
  1. Send POST request to `/auth/register`
  2. Include valid user data (name, email, password, address, phone, dob, nic)
  3. Include avatar file (optional)
  4. Verify response status and data
- **Expected Results:**
  - Status code: 201
  - Response contains user data (excluding password)
  - User is created in database
  - Password is hashed
  - Avatar is uploaded to Cloudinary (if provided)
- **Test Data:**
  ```json
  {
    "name": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "address": "123 Main St, City",
    "phone": "1234567890",
    "dob": "1990-01-01",
    "nic": "1234567890123"
  }
  ```
- **Post-conditions:** User account is created and accessible
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-BE-AUTH-002**
- **Test Case ID:** TC-BE-AUTH-002
- **Test Case Name:** User Registration with Duplicate Email
- **Purpose/Objective:** Verify that registration fails when using an existing email address
- **Pre-conditions:** 
  - Backend server is running
  - User with email "john.doe@example.com" already exists
- **Test Steps:**
  1. Send POST request to `/auth/register`
  2. Include user data with existing email
  3. Verify response status and error message
- **Expected Results:**
  - Status code: 409
  - Error message indicates duplicate email
  - No new user is created
- **Test Data:**
  ```json
  {
    "name": "Jane Doe",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "address": "456 Oak St, City",
    "phone": "0987654321",
    "dob": "1995-05-05",
    "nic": "9876543210987"
  }
  ```
- **Post-conditions:** No new user account is created
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-BE-AUTH-003**
- **Test Case ID:** TC-BE-AUTH-003
- **Test Case Name:** User Login with Valid Credentials
- **Purpose/Objective:** Verify that users can login successfully with correct credentials
- **Pre-conditions:** 
  - Backend server is running
  - User account exists in database
- **Test Steps:**
  1. Send POST request to `/auth/login`
  2. Include valid email and password
  3. Verify response status and data
- **Expected Results:**
  - Status code: 200
  - Response contains access_token
  - Response contains user data
  - Response contains stream_chat_token
- **Test Data:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Post-conditions:** User is authenticated and can access protected endpoints
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-BE-AUTH-004**
- **Test Case ID:** TC-BE-AUTH-004
- **Test Case Name:** User Login with Invalid Credentials
- **Purpose/Objective:** Verify that login fails with incorrect credentials
- **Pre-conditions:** 
  - Backend server is running
  - User account exists in database
- **Test Steps:**
  1. Send POST request to `/auth/login`
  2. Include invalid email or password
  3. Verify response status and error message
- **Expected Results:**
  - Status code: 401
  - Error message indicates invalid credentials
  - No access token is provided
- **Test Data:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "WrongPassword123!"
  }
  ```
- **Post-conditions:** User remains unauthenticated
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### User Module

#### **TC-BE-USER-001**
- **Test Case ID:** TC-BE-USER-001
- **Test Case Name:** Get User Profile
- **Purpose/Objective:** Verify that authenticated users can retrieve their profile information
- **Pre-conditions:** 
  - Backend server is running
  - User is authenticated with valid JWT token
- **Test Steps:**
  1. Send GET request to `/users/profile`
  2. Include Authorization header with JWT token
  3. Verify response status and data
- **Expected Results:**
  - Status code: 200
  - Response contains user profile data
  - Password field is not included in response
- **Test Data:**
  ```json
  {
    "Authorization": "Bearer <valid_jwt_token>"
  }
  ```
- **Post-conditions:** User profile data is retrieved successfully
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-BE-USER-002**
- **Test Case ID:** TC-BE-USER-002
- **Test Case Name:** Update User Profile
- **Purpose/Objective:** Verify that users can update their profile information
- **Pre-conditions:** 
  - Backend server is running
  - User is authenticated with valid JWT token
- **Test Steps:**
  1. Send PUT request to `/users/profile`
  2. Include updated user data
  3. Include Authorization header with JWT token
  4. Verify response status and data
- **Expected Results:**
  - Status code: 200
  - Response contains updated user data
  - Database is updated with new information
- **Test Data:**
  ```json
  {
    "name": "John Updated Doe",
    "address": "789 Pine St, New City",
    "phone": "5551234567",
    "bio": "Updated bio information"
  }
  ```
- **Post-conditions:** User profile is updated in database
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-BE-USER-003**
- **Test Case ID:** TC-BE-USER-003
- **Test Case Name:** Get User Statistics
- **Purpose/Objective:** Verify that user statistics are calculated and returned correctly
- **Pre-conditions:** 
  - Backend server is running
  - User exists with session history
  - Sessions module is properly configured
- **Test Steps:**
  1. Send GET request to `/users/:userId/stats`
  2. Include Authorization header with JWT token
  3. Verify response status and data
- **Expected Results:**
  - Status code: 200
  - Response contains user statistics
  - Statistics include total sessions, completed sessions, hosted sessions, participated sessions
  - Rating is calculated (mock value for now)
- **Test Data:**
  ```json
  {
    "userId": "valid_user_id",
    "Authorization": "Bearer <valid_jwt_token>"
  }
  ```
- **Post-conditions:** User statistics are retrieved successfully
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-BE-USER-004**
- **Test Case ID:** TC-BE-USER-004
- **Test Case Name:** Change User Password
- **Purpose/Objective:** Verify that users can change their password securely
- **Pre-conditions:** 
  - Backend server is running
  - User is authenticated with valid JWT token
- **Test Steps:**
  1. Send PUT request to `/users/change-password`
  2. Include current password and new password
  3. Include Authorization header with JWT token
  4. Verify response status
- **Expected Results:**
  - Status code: 200
  - Password is updated in database
  - New password is hashed
- **Test Data:**
  ```json
  {
    "currentPassword": "SecurePass123!",
    "newPassword": "NewSecurePass456!"
  }
  ```
- **Post-conditions:** User password is updated in database
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### Skills Module

#### **TC-BE-SKILLS-001**
- **Test Case ID:** TC-BE-SKILLS-001
- **Test Case Name:** Create New Skill
- **Purpose/Objective:** Verify that users can create new skills with required metadata
- **Pre-conditions:** 
  - Backend server is running
  - User is authenticated with valid JWT token
  - Python API is accessible
- **Test Steps:**
  1. Send POST request to `/skills`
  2. Include skill data with exactly 5 sub-topics
  3. Include Authorization header with JWT token
  4. Verify response status and data
- **Expected Results:**
  - Status code: 201
  - Skill is created in database
  - Metadata is sent to Python API for processing
  - Response contains skill data with generated metadata
- **Test Data:**
  ```json
  {
    "name": "JavaScript Programming",
    "category": "Programming",
    "proficiency": 85,
    "type": "teaching",
    "description": "Advanced JavaScript concepts",
    "subTopics": ["ES6+", "React", "Node.js", "TypeScript", "Testing"]
  }
  ```
- **Post-conditions:** Skill is created and metadata is processed
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-BE-SKILLS-002**
- **Test Case ID:** TC-BE-SKILLS-002
- **Test Case Name:** Get User Skills
- **Purpose/Objective:** Verify that users can retrieve their skills
- **Pre-conditions:** 
  - Backend server is running
  - User is authenticated with valid JWT token
  - User has skills in database
- **Test Steps:**
  1. Send GET request to `/skills`
  2. Include Authorization header with JWT token
  3. Verify response status and data
- **Expected Results:**
  - Status code: 200
  - Response contains array of user skills
  - Skills are separated by type (teaching/learning)
- **Test Data:**
  ```json
  {
    "Authorization": "Bearer <valid_jwt_token>"
  }
  ```
- **Post-conditions:** User skills are retrieved successfully
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-BE-SKILLS-003**
- **Test Case ID:** TC-BE-SKILLS-003
- **Test Case Name:** Get Suggested Users
- **Purpose/Objective:** Verify that AI-powered user suggestions work correctly
- **Pre-conditions:** 
  - Backend server is running
  - User is authenticated with valid JWT token
  - Multiple users with skills exist
  - Python API is accessible
- **Test Steps:**
  1. Send GET request to `/skills/suggested-users`
  2. Include Authorization header with JWT token
  3. Verify response status and data
- **Expected Results:**
  - Status code: 200
  - Response contains suggested users
  - Users are categorized by match type (can_teach, wants_to_learn, mutual_match)
  - Matching skills are identified
- **Test Data:**
  ```json
  {
    "Authorization": "Bearer <valid_jwt_token>"
  }
  ```
- **Post-conditions:** Suggested users are retrieved successfully
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### Sessions Module

#### **TC-BE-SESSIONS-001**
- **Test Case ID:** TC-BE-SESSIONS-001
- **Test Case Name:** Create New Session
- **Purpose/Objective:** Verify that users can create new learning sessions
- **Pre-conditions:** 
  - Backend server is running
  - User is authenticated with valid JWT token
  - User has teachable skills
- **Test Steps:**
  1. Send POST request to `/sessions`
  2. Include session data with required fields
  3. Include Authorization header with JWT token
  4. Verify response status and data
- **Expected Results:**
  - Status code: 201
  - Session is created in database
  - Session metadata is sent to Python API
  - Response contains session data
- **Test Data:**
  ```json
  {
    "title": "Learn JavaScript Basics",
    "description": "Introduction to JavaScript programming",
    "date": "2024-02-15",
    "startTime": "10:00",
    "endTime": "11:00",
    "maxParticipants": 5,
    "teachSkillId": "skill_id_123",
    "teachSkillName": "JavaScript Programming",
    "focusedTopics": ["Variables", "Functions", "Objects"],
    "subTopics": ["ES6", "DOM", "Events", "AJAX", "Promises"],
    "meetingLink": "https://meet.google.com/abc-def-ghi",
    "focusKeywords": ["javascript", "programming", "web development"]
  }
  ```
- **Post-conditions:** Session is created and metadata is processed
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-BE-SESSIONS-002**
- **Test Case ID:** TC-BE-SESSIONS-002
- **Test Case Name:** Get User Sessions
- **Purpose/Objective:** Verify that users can retrieve their sessions
- **Pre-conditions:** 
  - Backend server is running
  - User is authenticated with valid JWT token
  - User has sessions in database
- **Test Steps:**
  1. Send GET request to `/sessions`
  2. Include Authorization header with JWT token
  3. Verify response status and data
- **Expected Results:**
  - Status code: 200
  - Response contains array of user sessions
  - Sessions include metadata from Python API
- **Test Data:**
  ```json
  {
    "Authorization": "Bearer <valid_jwt_token>"
  }
  ```
- **Post-conditions:** User sessions are retrieved successfully
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-BE-SESSIONS-003**
- **Test Case ID:** TC-BE-SESSIONS-003
- **Test Case Name:** Get Suggested Sessions
- **Purpose/Objective:** Verify that AI-powered session suggestions work correctly
- **Pre-conditions:** 
  - Backend server is running
  - User is authenticated with valid JWT token
  - Multiple sessions exist with metadata
  - Python API is accessible
- **Test Steps:**
  1. Send GET request to `/sessions/suggested`
  2. Include Authorization header with JWT token
  3. Verify response status and data
- **Expected Results:**
  - Status code: 200
  - Response contains suggested sessions
  - Sessions match user's learning interests
  - Sessions are categorized by match type
- **Test Data:**
  ```json
  {
    "Authorization": "Bearer <valid_jwt_token>"
  }
  ```
- **Post-conditions:** Suggested sessions are retrieved successfully
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### Exchange Sessions Module

#### **TC-BE-EXCHANGE-001**
- **Test Case ID:** TC-BE-EXCHANGE-001
- **Test Case Name:** Create Exchange Session
- **Purpose/Objective:** Verify that users can create skill exchange sessions
- **Pre-conditions:** 
  - Backend server is running
  - User is authenticated with valid JWT token
  - User has both teachable and learnable skills
- **Test Steps:**
  1. Send POST request to `/exchange-sessions`
  2. Include exchange session data
  3. Include Authorization header with JWT token
  4. Verify response status and data
- **Expected Results:**
  - Status code: 201
  - Exchange session is created in database
  - Both teach and learn skills are recorded
  - Response contains exchange session data
- **Test Data:**
  ```json
  {
    "title": "JavaScript for Python Exchange",
    "description": "Exchange JavaScript knowledge for Python skills",
    "date": "2024-02-20",
    "startTime": "14:00",
    "endTime": "15:30",
    "maxParticipants": 2,
    "teachSkillId": "js_skill_id",
    "teachSkillName": "JavaScript Programming",
    "learnSkillId": "python_skill_id",
    "learnSkillName": "Python Programming",
    "meetingLink": "https://meet.google.com/xyz-abc-def"
  }
  ```
- **Post-conditions:** Exchange session is created successfully
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-BE-EXCHANGE-002**
- **Test Case ID:** TC-BE-EXCHANGE-002
- **Test Case Name:** Get Exchange Session Statistics
- **Purpose/Objective:** Verify that exchange session statistics are calculated correctly
- **Pre-conditions:** 
  - Backend server is running
  - User is authenticated with valid JWT token
  - User has exchange session history
- **Test Steps:**
  1. Send GET request to `/exchange-sessions/stats`
  2. Include Authorization header with JWT token
  3. Verify response status and data
- **Expected Results:**
  - Status code: 200
  - Response contains exchange session statistics
  - Statistics include completed, scheduled, and unique partners
- **Test Data:**
  ```json
  {
    "Authorization": "Bearer <valid_jwt_token>"
  }
  ```
- **Post-conditions:** Exchange session statistics are retrieved successfully
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

---

## Frontend Test Cases (React)

### Authentication Components

#### **TC-FE-AUTH-001**
- **Test Case ID:** TC-FE-AUTH-001
- **Test Case Name:** Login Form Validation
- **Purpose/Objective:** Verify that login form validates input correctly
- **Pre-conditions:** 
  - Frontend application is running
  - Login page is accessible
- **Test Steps:**
  1. Navigate to login page
  2. Enter invalid email format
  3. Submit form
  4. Verify error message display
- **Expected Results:**
  - Error message appears for invalid email
  - Form does not submit
  - Error styling is applied
- **Test Data:**
  ```json
  {
    "email": "invalid-email",
    "password": "password123"
  }
  ```
- **Post-conditions:** Form shows validation error
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-FE-AUTH-002**
- **Test Case ID:** TC-FE-AUTH-002
- **Test Case Name:** Login Form Successful Submission
- **Purpose/Objective:** Verify that login form submits successfully with valid data
- **Pre-conditions:** 
  - Frontend application is running
  - Backend API is accessible
  - Valid user account exists
- **Test Steps:**
  1. Navigate to login page
  2. Enter valid credentials
  3. Submit form
  4. Verify successful login
- **Expected Results:**
  - Form submits successfully
  - User is redirected to dashboard
  - User data is stored in localStorage
  - Success toast notification appears
- **Test Data:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Post-conditions:** User is logged in and redirected to dashboard
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-FE-AUTH-003**
- **Test Case ID:** TC-FE-AUTH-003
- **Test Case Name:** Signup Form Password Validation
- **Purpose/Objective:** Verify that signup form validates password requirements
- **Pre-conditions:** 
  - Frontend application is running
  - Signup page is accessible
- **Test Steps:**
  1. Navigate to signup page
  2. Enter password that doesn't meet requirements
  3. Verify password requirement indicators
  4. Submit form
- **Expected Results:**
  - Password requirement indicators show status
  - Form prevents submission with weak password
  - Error messages are displayed
- **Test Data:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "weak"
  }
  ```
- **Post-conditions:** Form shows password validation errors
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### Dashboard Components

#### **TC-FE-DASH-001**
- **Test Case ID:** TC-FE-DASH-001
- **Test Case Name:** Dashboard Load with User Data
- **Purpose/Objective:** Verify that dashboard displays user information correctly
- **Pre-conditions:** 
  - Frontend application is running
  - User is authenticated
  - User data is available
- **Test Steps:**
  1. Navigate to dashboard
  2. Verify user information display
  3. Check suggested connections
  4. Verify upcoming sessions
- **Expected Results:**
  - User name is displayed correctly
  - Suggested connections are shown
  - Upcoming sessions are displayed
  - Analytics cards show data
- **Test Data:**
  ```json
  {
    "user": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
  ```
- **Post-conditions:** Dashboard displays all components correctly
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-FE-DASH-002**
- **Test Case ID:** TC-FE-DASH-002
- **Test Case Name:** User Profile Modal Display
- **Purpose/Objective:** Verify that user profile modal shows correct information
- **Pre-conditions:** 
  - Frontend application is running
  - User is authenticated
  - Suggested connections are loaded
- **Test Steps:**
  1. Click on suggested user
  2. Verify modal opens
  3. Check user information display
  4. Verify skills separation
- **Expected Results:**
  - Modal opens with user information
  - Skills are separated by type (teaching/learning)
  - User statistics are displayed
  - Skills show progress bars
- **Test Data:**
  ```json
  {
    "user": {
      "name": "Jane Smith",
      "skills": [
        {"name": "JavaScript", "type": "teaching", "proficiency": 85},
        {"name": "Python", "type": "learning", "proficiency": 60}
      ]
    }
  }
  ```
- **Post-conditions:** User profile modal displays correctly
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### Skills Components

#### **TC-FE-SKILLS-001**
- **Test Case ID:** TC-FE-SKILLS-001
- **Test Case Name:** Add Skill Modal Validation
- **Purpose/Objective:** Verify that add skill modal validates required fields
- **Pre-conditions:** 
  - Frontend application is running
  - User is authenticated
  - Skills page is accessible
- **Test Steps:**
  1. Navigate to skills page
  2. Click "Add Skill" button
  3. Try to submit without required fields
  4. Verify validation messages
- **Expected Results:**
  - Form prevents submission
  - Error messages appear for missing fields
  - Sub-topics validation works (exactly 5 required)
- **Test Data:**
  ```json
  {
    "name": "",
    "category": "",
    "proficiency": 0,
    "type": "",
    "subTopics": ["topic1", "topic2"]
  }
  ```
- **Post-conditions:** Form shows validation errors
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-FE-SKILLS-002**
- **Test Case ID:** TC-FE-SKILLS-002
- **Test Case Name:** Add Skill Successful Creation
- **Purpose/Objective:** Verify that skills can be created successfully
- **Pre-conditions:** 
  - Frontend application is running
  - User is authenticated
  - Backend API is accessible
- **Test Steps:**
  1. Navigate to skills page
  2. Click "Add Skill" button
  3. Fill all required fields
  4. Submit form
- **Expected Results:**
  - Skill is created successfully
  - Success toast notification appears
  - Skills list is updated
  - Modal closes
- **Test Data:**
  ```json
  {
    "name": "React Development",
    "category": "Programming",
    "proficiency": 90,
    "type": "teaching",
    "description": "Advanced React concepts",
    "subTopics": ["Hooks", "Context", "Redux", "Testing", "Performance"]
  }
  ```
- **Post-conditions:** New skill is added to user's skills
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### Sessions Components

#### **TC-FE-SESSIONS-001**
- **Test Case ID:** TC-FE-SESSIONS-001
- **Test Case Name:** Create Session Modal Validation
- **Purpose/Objective:** Verify that create session modal validates required fields
- **Pre-conditions:** 
  - Frontend application is running
  - User is authenticated
  - User has teachable skills
- **Test Steps:**
  1. Navigate to sessions page
  2. Click "Create Session" button
  3. Try to submit without required fields
  4. Verify validation messages
- **Expected Results:**
  - Form prevents submission
  - Error messages appear for missing fields
  - Date and time validation works
- **Test Data:**
  ```json
  {
    "title": "",
    "description": "",
    "date": "",
    "startTime": "",
    "endTime": ""
  }
  ```
- **Post-conditions:** Form shows validation errors
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-FE-SESSIONS-002**
- **Test Case ID:** TC-FE-SESSIONS-002
- **Test Case Name:** Create Session Successful Creation
- **Purpose/Objective:** Verify that sessions can be created successfully
- **Pre-conditions:** 
  - Frontend application is running
  - User is authenticated
  - User has teachable skills
  - Backend API is accessible
- **Test Steps:**
  1. Navigate to sessions page
  2. Click "Create Session" button
  3. Fill all required fields
  4. Submit form
- **Expected Results:**
  - Session is created successfully
  - Success toast notification appears
  - Sessions list is updated
  - Modal closes
- **Test Data:**
  ```json
  {
    "title": "Learn JavaScript Basics",
    "description": "Introduction to JavaScript programming",
    "date": "2024-02-15",
    "startTime": "10:00",
    "endTime": "11:00",
    "maxParticipants": 5,
    "teachSkillId": "skill_id_123",
    "teachSkillName": "JavaScript Programming",
    "focusedTopics": ["Variables", "Functions", "Objects"],
    "subTopics": ["ES6", "DOM", "Events", "AJAX", "Promises"],
    "meetingLink": "https://meet.google.com/abc-def-ghi"
  }
  ```
- **Post-conditions:** New session is created and listed
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### Custom Hooks

#### **TC-FE-HOOKS-001**
- **Test Case ID:** TC-FE-HOOKS-001
- **Test Case Name:** useGetUserStats Hook
- **Purpose/Objective:** Verify that useGetUserStats hook fetches user statistics correctly
- **Pre-conditions:** 
  - Frontend application is running
  - Backend API is accessible
  - User is authenticated
- **Test Steps:**
  1. Use useGetUserStats hook in component
  2. Verify loading state
  3. Verify data fetching
  4. Verify error handling
- **Expected Results:**
  - Hook returns loading state initially
  - Hook fetches user statistics successfully
  - Hook handles errors gracefully
  - Data is cached appropriately
- **Test Data:**
  ```json
  {
    "userId": "valid_user_id"
  }
  ```
- **Post-conditions:** User statistics are available in component
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-FE-HOOKS-002**
- **Test Case ID:** TC-FE-HOOKS-002
- **Test Case Name:** useCreateSession Hook
- **Purpose/Objective:** Verify that useCreateSession hook creates sessions correctly
- **Pre-conditions:** 
  - Frontend application is running
  - Backend API is accessible
  - User is authenticated
- **Test Steps:**
  1. Use useCreateSession hook in component
  2. Call mutate function with session data
  3. Verify loading state
  4. Verify success/error handling
- **Expected Results:**
  - Hook shows loading state during creation
  - Session is created successfully
  - Success callback is triggered
  - Error handling works correctly
- **Test Data:**
  ```json
  {
    "title": "Test Session",
    "description": "Test session description",
    "date": "2024-02-15",
    "startTime": "10:00",
    "endTime": "11:00"
  }
  ```
- **Post-conditions:** Session is created via hook
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

---

## Python API Test Cases

### LLM Module

#### **TC-PY-LLM-001**
- **Test Case ID:** TC-PY-LLM-001
- **Test Case Name:** Generate Keywords from Topic
- **Purpose/Objective:** Verify that LLM generates relevant keywords from topic and sub-topics
- **Pre-conditions:** 
  - Python API server is running
  - Google API key is configured
  - LLM model is accessible
- **Test Steps:**
  1. Send POST request to `/api/v1/llm/query`
  2. Include topic and sub-topics
  3. Verify response format
- **Expected Results:**
  - Status code: 200
  - Response contains list of keywords
  - Keywords are relevant to topic
  - Keywords are stored in Pinecone
- **Test Data:**
  ```json
  {
    "topic": "JavaScript Programming",
    "sub_topics": ["ES6+", "React", "Node.js", "TypeScript", "Testing"]
  }
  ```
- **Post-conditions:** Keywords are generated and stored
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-PY-LLM-002**
- **Test Case ID:** TC-PY-LLM-002
- **Test Case Name:** LLM Query with Invalid Data
- **Purpose/Objective:** Verify that LLM endpoint handles invalid data correctly
- **Pre-conditions:** 
  - Python API server is running
  - Google API key is configured
- **Test Steps:**
  1. Send POST request to `/api/v1/llm/query`
  2. Include invalid or missing data
  3. Verify error response
- **Expected Results:**
  - Status code: 400
  - Error message indicates invalid data
  - No keywords are generated
- **Test Data:**
  ```json
  {
    "topic": "",
    "sub_topics": []
  }
  ```
- **Post-conditions:** Error is handled gracefully
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### Agent Module

#### **TC-PY-AGENT-001**
- **Test Case ID:** TC-PY-AGENT-001
- **Test Case Name:** Search Keywords from Pinecone
- **Purpose/Objective:** Verify that keyword search functionality works correctly
- **Pre-conditions:** 
  - Python API server is running
  - Pinecone index is configured
  - Keywords exist in index
- **Test Steps:**
  1. Send POST request to `/api/v1/search/keywords`
  2. Include keywords to search
  3. Verify response format
- **Expected Results:**
  - Status code: 200
  - Response contains relevant results
  - Results match similarity threshold
- **Test Data:**
  ```json
  {
    "keywords": ["javascript", "programming"],
    "similarity_threshold": 0.2,
    "namespace": ""
  }
  ```
- **Post-conditions:** Search results are returned
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

#### **TC-PY-AGENT-002**
- **Test Case ID:** TC-PY-AGENT-002
- **Test Case Name:** Direct Keyword Search
- **Purpose/Objective:** Verify that direct keyword search returns raw text content
- **Pre-conditions:** 
  - Python API server is running
  - Pinecone index is configured
  - Content exists in index
- **Test Steps:**
  1. Send POST request to `/api/v1/search/keywords-direct`
  2. Include keywords to search
  3. Verify response format
- **Expected Results:**
  - Status code: 200
  - Response contains raw text content
  - Content is relevant to keywords
- **Test Data:**
  ```json
  {
    "keywords": ["react", "frontend"],
    "similarity_threshold": 0.3,
    "namespace": ""
  }
  ```
- **Post-conditions:** Raw text content is returned
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### Pinecone Integration

#### **TC-PY-PINECONE-001**
- **Test Case ID:** TC-PY-PINECONE-001
- **Test Case Name:** Upsert Text to Pinecone
- **Purpose/Objective:** Verify that text can be stored in Pinecone index
- **Pre-conditions:** 
  - Python API server is running
  - Pinecone index is configured
  - Pinecone API key is valid
- **Test Steps:**
  1. Call upsert_text_to_pinecone function
  2. Include text data
  3. Verify storage success
- **Expected Results:**
  - Text is stored in Pinecone index
  - No errors occur during storage
  - Data is retrievable
- **Test Data:**
  ```json
  {
    "text_list": ["javascript", "programming", "web development", "frontend", "backend"]
  }
  ```
- **Post-conditions:** Text is stored in Pinecone index
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

---

## Integration Test Cases

### Backend-Frontend Integration

#### **TC-INT-001**
- **Test Case ID:** TC-INT-001
- **Test Case Name:** End-to-End User Registration and Login
- **Purpose/Objective:** Verify complete user registration and login flow
- **Pre-conditions:** 
  - All services are running
  - Database is accessible
  - File storage is configured
- **Test Steps:**
  1. Register new user via frontend
  2. Verify user creation in database
  3. Login with new credentials
  4. Verify authentication and session
- **Expected Results:**
  - User registration succeeds
  - User data is stored correctly
  - Login works with new credentials
  - JWT token is generated
- **Test Data:**
  ```json
  {
    "registration": {
      "name": "Test User",
      "email": "test@example.com",
      "password": "SecurePass123!"
    },
    "login": {
      "email": "test@example.com",
      "password": "SecurePass123!"
    }
  }
  ```
- **Post-conditions:** User can access protected features
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### Backend-Python API Integration

#### **TC-INT-002**
- **Test Case ID:** TC-INT-002
- **Test Case Name:** Skill Creation with Metadata Generation
- **Purpose/Objective:** Verify that skill creation triggers metadata generation
- **Pre-conditions:** 
  - All services are running
  - Python API is accessible
  - Pinecone is configured
- **Test Steps:**
  1. Create skill via backend API
  2. Verify data sent to Python API
  3. Verify metadata generation
  4. Verify Pinecone storage
- **Expected Results:**
  - Skill is created in database
  - Metadata is generated by Python API
  - Keywords are stored in Pinecone
  - Response includes metadata
- **Test Data:**
  ```json
  {
    "skill": {
      "name": "Python Programming",
      "category": "Programming",
      "proficiency": 80,
      "type": "teaching",
      "subTopics": ["Basics", "OOP", "Web", "Data", "Testing"]
    }
  }
  ```
- **Post-conditions:** Skill has generated metadata
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

---

## Performance Test Cases

### Backend Performance

#### **TC-PERF-001**
- **Test Case ID:** TC-PERF-001
- **Test Case Name:** User Registration Performance
- **Purpose/Objective:** Verify that user registration completes within acceptable time
- **Pre-conditions:** 
  - Backend server is running
  - Database is accessible
  - File storage is configured
- **Test Steps:**
  1. Send multiple registration requests
  2. Measure response times
  3. Verify all requests complete
- **Expected Results:**
  - Response time < 2 seconds
  - All requests complete successfully
  - No timeouts occur
- **Test Data:**
  ```json
  {
    "concurrent_users": 10,
    "requests_per_user": 5
  }
  ```
- **Post-conditions:** All registrations complete successfully
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### Frontend Performance

#### **TC-PERF-002**
- **Test Case ID:** TC-PERF-002
- **Test Case Name:** Dashboard Load Performance
- **Purpose/Objective:** Verify that dashboard loads within acceptable time
- **Pre-conditions:** 
  - Frontend application is running
  - Backend API is accessible
  - User is authenticated
- **Test Steps:**
  1. Navigate to dashboard
  2. Measure load time
  3. Verify all components load
- **Expected Results:**
  - Dashboard loads < 3 seconds
  - All components render correctly
  - No loading errors
- **Test Data:**
  ```json
  {
    "user_data_size": "medium",
    "suggestions_count": 10,
    "sessions_count": 5
  }
  ```
- **Post-conditions:** Dashboard is fully functional
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

---

## Security Test Cases

### Authentication Security

#### **TC-SEC-001**
- **Test Case ID:** TC-SEC-001
- **Test Case Name:** JWT Token Validation
- **Purpose/Objective:** Verify that JWT tokens are validated correctly
- **Pre-conditions:** 
  - Backend server is running
  - User is authenticated
- **Test Steps:**
  1. Access protected endpoint with valid token
  2. Access protected endpoint with invalid token
  3. Access protected endpoint without token
- **Expected Results:**
  - Valid token allows access
  - Invalid token returns 401
  - Missing token returns 401
- **Test Data:**
  ```json
  {
    "valid_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "invalid_token": "invalid.jwt.token",
    "no_token": null
  }
  ```
- **Post-conditions:** Authentication works correctly
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

### Input Validation Security

#### **TC-SEC-002**
- **Test Case ID:** TC-SEC-002
- **Test Case Name:** SQL Injection Prevention
- **Purpose/Objective:** Verify that SQL injection attacks are prevented
- **Pre-conditions:** 
  - Backend server is running
  - Database is accessible
- **Test Steps:**
  1. Send malicious SQL injection payloads
  2. Verify database remains secure
  3. Check for error handling
- **Expected Results:**
  - Malicious payloads are rejected
  - Database integrity is maintained
  - Proper error messages are returned
- **Test Data:**
  ```json
  {
    "malicious_payloads": [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "'; INSERT INTO users VALUES ('hacker', 'password'); --"
    ]
  }
  ```
- **Post-conditions:** Database remains secure
- **Status:** Not Executed
- **Actual Results:** (To be filled during execution)

---

## Test Execution Summary

### Test Categories
- **Backend Tests:** 15 test cases
- **Frontend Tests:** 10 test cases  
- **Python API Tests:** 5 test cases
- **Integration Tests:** 2 test cases
- **Performance Tests:** 2 test cases
- **Security Tests:** 2 test cases

### Total Test Cases: 36

### Priority Levels
- **High Priority:** Authentication, User Management, Core Features
- **Medium Priority:** Skills, Sessions, Dashboard Features
- **Low Priority:** Performance, Security, Edge Cases

### Execution Order
1. Backend Unit Tests
2. Frontend Unit Tests
3. Python API Tests
4. Integration Tests
5. Performance Tests
6. Security Tests

This comprehensive test suite ensures thorough coverage of all application components and functionality. 