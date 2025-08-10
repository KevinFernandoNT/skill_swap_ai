## Backend Test Cases (NestJS API)

TC-BE-AUTH-001
• Test Case ID: TC-BE-AUTH-001
• Test Case Name: User Registration with Valid Data
• Purpose/Objective: Verify that a new user can be registered successfully with valid information
• Pre-conditions:
  - Backend server is running
  - Database connection is established
  - File storage is configured (for avatar)
• Test Steps:
  i. Send POST request to /auth/register
  ii. Include valid user data (name, email, password, address, phone, dob, nic)
  iii. Include avatar file (optional)
  iv. Verify response status and data
• Expected Results:
  - Status code: 201
  - Response contains user data (excluding password)
  - User is created in database
  - Password is hashed
  - Avatar uploaded if provided
• Dataset Snapshot:
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
• Actual Result: Success. 201 Created; user persisted; password hashed; avatar uploaded when provided.

TC-BE-AUTH-002
• Test Case ID: TC-BE-AUTH-002
• Test Case Name: User Registration with Duplicate Email
• Purpose/Objective: Ensure registration fails on duplicate email
• Pre-conditions:
  - User with email exists
• Test Steps:
  i. POST /auth/register with existing email
• Expected Results:
  - Status 409
  - Error message indicates duplicate
• Dataset Snapshot:
```json
{ "email": "john.doe@example.com", "password": "SecurePass123!", "name": "John" }
```
• Actual Result: Success. 409 Conflict; duplicate email error.

TC-BE-AUTH-003
• Test Case ID: TC-BE-AUTH-003
• Test Case Name: Registration Missing Required Field
• Purpose/Objective: Validate server-side DTO validation
• Pre-conditions:
  - API running
• Test Steps:
  i. POST /auth/register without email
• Expected Results:
  - Status 400
  - Validation error details
• Dataset Snapshot:
```json
{ "name": "John", "password": "SecurePass123!" }
```
• Actual Result: Success. 400 Bad Request with validation errors.

TC-BE-AUTH-004
• Test Case ID: TC-BE-AUTH-004
• Test Case Name: User Login with Valid Credentials
• Purpose/Objective: Verify login returns tokens and user
• Pre-conditions:
  - Registered user exists
• Test Steps:
  i. POST /auth/login with email and password
• Expected Results:
  - Status 200
  - Returns access_token, user, stream_chat_token
• Dataset Snapshot:
```json
{ "email": "john.doe@example.com", "password": "SecurePass123!" }
```
• Actual Result: Success. 200 OK; tokens and user returned.

TC-BE-AUTH-005
• Test Case ID: TC-BE-AUTH-005
• Test Case Name: User Login with Invalid Credentials
• Purpose/Objective: Ensure invalid login is rejected
• Pre-conditions:
  - User exists
• Test Steps:
  i. POST /auth/login with wrong password
• Expected Results:
  - Status 401
  - Error indicates invalid credentials
• Dataset Snapshot:
```json
{ "email": "john.doe@example.com", "password": "WrongPass!" }
```
• Actual Result: Success. 401 Unauthorized.

TC-BE-AUTH-006
• Test Case ID: TC-BE-AUTH-006
• Test Case Name: Access Protected Route Without Token
• Purpose/Objective: Verify JWT guard blocks unauthenticated access
• Pre-conditions:
  - API running
• Test Steps:
  i. GET /users/profile without Authorization header
• Expected Results:
  - Status 401
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. 401 Unauthorized.

TC-BE-USER-001
• Test Case ID: TC-BE-USER-001
• Test Case Name: Get Current User Profile
• Purpose/Objective: Verify profile retrieval
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. GET /users/profile with Authorization
• Expected Results:
  - Status 200
  - User profile without password
• Dataset Snapshot:
```json
{ "Authorization": "Bearer <token>" }
```
• Actual Result: Success. 200 OK; profile returned.

TC-BE-USER-002
• Test Case ID: TC-BE-USER-002
• Test Case Name: Update User Profile
• Purpose/Objective: Verify profile update with optional avatar
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. PUT /users/profile (multipart form-data)
• Expected Results:
  - Status 200
  - Updated user returned and persisted
• Dataset Snapshot:
```json
{ "name": "John Updated", "location": "Seattle, WA", "bio": "Updated" }
```
• Actual Result: Success. 200 OK; updated fields persisted.

TC-BE-USER-003
• Test Case ID: TC-BE-USER-003
• Test Case Name: Change Password with Current Password
• Purpose/Objective: Verify secure password change
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. PUT /users/change-password with { currentPassword, newPassword }
  ii. Login with new password
• Expected Results:
  - Status 200
  - Password hash updated; login succeeds with new password
• Dataset Snapshot:
```json
{ "currentPassword": "SecurePass123!", "newPassword": "NewSecurePass456!" }
```
• Actual Result: Success. 200 OK; new password valid for login.

TC-BE-USER-004
• Test Case ID: TC-BE-USER-004
• Test Case Name: Search Users by Query
• Purpose/Objective: Verify search endpoint
• Pre-conditions:
  - Users exist
• Test Steps:
  i. GET /users/search?q=john
• Expected Results:
  - Status 200
  - Matching users returned
• Dataset Snapshot:
```json
{ "q": "john" }
```
• Actual Result: Success. 200 OK; results include matched users.

TC-BE-USER-005
• Test Case ID: TC-BE-USER-005
• Test Case Name: Get Suggested Users
• Purpose/Objective: Verify suggestions endpoint returns up to 10 users
• Pre-conditions:
  - Users seeded
• Test Steps:
  i. GET /users/suggested
• Expected Results:
  - Status 200
  - <= 10 users
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. 200 OK; list of suggested users.

TC-BE-SKILLS-001
• Test Case ID: TC-BE-SKILLS-001
• Test Case Name: Create New Skill
• Purpose/Objective: Verify skill creation
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. POST /skills with required fields
• Expected Results:
  - Status 201
  - Skill created and returned
• Dataset Snapshot:
```json
{ "name": "React", "category": "Programming", "proficiency": 85, "type": "teaching", "subTopics": ["Hooks","State","Routing","Context","Testing"] }
```
• Actual Result: Success. 201 Created; skill persisted.

TC-BE-SKILLS-002
• Test Case ID: TC-BE-SKILLS-002
• Test Case Name: Get User Skills
• Purpose/Objective: Verify skills listing
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. GET /skills
• Expected Results:
  - Status 200
  - Array of skills
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. 200 OK; skills returned.

TC-BE-SKILLS-003
• Test Case ID: TC-BE-SKILLS-003
• Test Case Name: Update Skill
• Purpose/Objective: Verify update flow
• Pre-conditions:
  - Skill exists and owned by user
• Test Steps:
  i. PUT /skills/:id
• Expected Results:
  - Status 200
  - Updated fields returned
• Dataset Snapshot:
```json
{ "proficiency": 90 }
```
• Actual Result: Success. 200 OK; skill updated.

TC-BE-SKILLS-004
• Test Case ID: TC-BE-SKILLS-004
• Test Case Name: Delete Skill
• Purpose/Objective: Verify deletion flow
• Pre-conditions:
  - Skill exists and owned by user
• Test Steps:
  i. DELETE /skills/:id
• Expected Results:
  - Status 200/204
  - Skill removed
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. Skill deleted.

TC-BE-SESS-001
• Test Case ID: TC-BE-SESS-001
• Test Case Name: Create Session
• Purpose/Objective: Verify session creation
• Pre-conditions:
  - Valid JWT
  - Teachable skill exists
• Test Steps:
  i. POST /sessions with required fields
• Expected Results:
  - Status 201
  - Session created
• Dataset Snapshot:
```json
{ "title":"React Hooks", "date":"2025-08-20", "startTime":"10:00", "endTime":"11:00", "skillCategory":"Programming", "isTeaching":true, "teachSkillId":"<skill_id>", "subTopics":["Hooks","Effects","Memo"], "focusKeywords":["react","hooks"] }
```
• Actual Result: Success. 201 Created; session persisted.

TC-BE-SESS-002
• Test Case ID: TC-BE-SESS-002
• Test Case Name: Get User Sessions
• Purpose/Objective: Verify sessions list
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. GET /sessions
• Expected Results:
  - Status 200
  - Array of sessions
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. 200 OK; sessions returned.

TC-BE-SESS-003
• Test Case ID: TC-BE-SESS-003
• Test Case Name: Update Session (Reschedule)
• Purpose/Objective: Verify rescheduling
• Pre-conditions:
  - Session exists and owned by user
• Test Steps:
  i. PUT /sessions/:id with new date/time
• Expected Results:
  - Status 200
  - Updated times persisted
• Dataset Snapshot:
```json
{ "date":"2025-08-22", "startTime":"12:00", "endTime":"13:00" }
```
• Actual Result: Success. 200 OK; times updated.

TC-BE-SESS-004
• Test Case ID: TC-BE-SESS-004
• Test Case Name: Cancel Session
• Purpose/Objective: Verify cancellation
• Pre-conditions:
  - Session exists and owned
• Test Steps:
  i. PUT /sessions/:id with {"status":"cancelled"}
• Expected Results:
  - Status 200
  - status=cancelled
• Dataset Snapshot:
```json
{ "status": "cancelled" }
```
• Actual Result: Success. 200 OK; session cancelled.

TC-BE-EXREQ-001
• Test Case ID: TC-BE-EXREQ-001
• Test Case Name: Create Exchange Request
• Purpose/Objective: Verify creation
• Pre-conditions:
  - Valid JWT; session/skills exist
• Test Steps:
  i. POST /exchange-requests
• Expected Results:
  - Status 201
  - status=pending
• Dataset Snapshot:
```json
{ "sessionId":"<session_id>", "recipient":"<user_id>", "offeredSkillId":"<skill_id>", "requestedSkillId":"<skill_id>" }
```
• Actual Result: Success. 201 Created.

TC-BE-EXREQ-002
• Test Case ID: TC-BE-EXREQ-002
• Test Case Name: Accept Exchange Request → Create Exchange Session + Notification
• Purpose/Objective: Verify side-effects
• Pre-conditions:
  - Pending request exists
• Test Steps:
  i. PATCH /exchange-requests/:id {"status":"accepted"}
• Expected Results:
  - Status 200
  - Notification to requester
  - Exchange session created
• Dataset Snapshot:
```json
{ "status": "accepted" }
```
• Actual Result: Success. 200 OK; session + notification created.

TC-BE-EXREQ-003
• Test Case ID: TC-BE-EXREQ-003
• Test Case Name: Reject Exchange Request (Notification Only)
• Purpose/Objective: Ensure no session creation on rejection
• Pre-conditions:
  - Pending request exists
• Test Steps:
  i. PATCH /exchange-requests/:id {"status":"rejected"}
• Expected Results:
  - Status 200
  - Rejection notification only
• Dataset Snapshot:
```json
{ "status": "rejected" }
```
• Actual Result: Success. 200 OK; notification created, no session.

TC-BE-EXREQ-004
• Test Case ID: TC-BE-EXREQ-004
• Test Case Name: Get Hosted Session Exchange Requests
• Purpose/Objective: Verify listing hosted-session requests
• Pre-conditions:
  - Host has a session with requests
• Test Steps:
  i. GET /exchange-requests/hosted-sessions
• Expected Results:
  - Status 200; list returned
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. 200 OK.

TC-BE-EXS-001
• Test Case ID: TC-BE-EXS-001
• Test Case Name: Start Exchange Session
• Purpose/Objective: Verify start transition
• Pre-conditions:
  - Exchange session status=upcoming
• Test Steps:
  i. PATCH /exchange-sessions/:id/start
• Expected Results:
  - Status 200; status=ongoing
• Dataset Snapshot:
```json
{ "id": "<exchange_session_id>" }
```
• Actual Result: Success. 200 OK; ongoing.

TC-BE-EXS-002
• Test Case ID: TC-BE-EXS-002
• Test Case Name: Complete Exchange Session
• Purpose/Objective: Verify complete transition
• Pre-conditions:
  - status=ongoing
• Test Steps:
  i. PATCH /exchange-sessions/:id/complete
• Expected Results:
  - Status 200; status=completed
• Dataset Snapshot:
```json
{ "id": "<exchange_session_id>" }
```
• Actual Result: Success. 200 OK; completed.

TC-BE-EXS-003
• Test Case ID: TC-BE-EXS-003
• Test Case Name: Upcoming Exchange Sessions (Dashboard)
• Purpose/Objective: Verify 3-day upcoming window
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. GET /exchange-sessions/upcoming-dashboard
• Expected Results:
  - Status 200; paginated list
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. 200 OK; list returned.

TC-BE-EXS-004
• Test Case ID: TC-BE-EXS-004
• Test Case Name: Exchange Session Stats
• Purpose/Objective: Verify stats response
• Pre-conditions:
  - Sessions exist
• Test Steps:
  i. GET /exchange-sessions/stats
• Expected Results:
  - Status 200; completedExchangeSessions, scheduledExchangeSessions, uniqueExchangePartners present
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. 200 OK; stats returned.

TC-BE-EXS-005
• Test Case ID: TC-BE-EXS-005
• Test Case Name: Expire Overdue Sessions (Cron)
• Purpose/Objective: Verify daily expiration of overdue upcoming sessions
• Pre-conditions:
  - Overdue upcoming sessions exist
• Test Steps:
  i. Trigger cron or call service to expire
• Expected Results:
  - Affected sessions status=expired
• Dataset Snapshot:
```json
{ "date":"<yesterday>", "startTime":"09:00", "status":"upcoming" }
```
• Actual Result: Success. Sessions expired.

TC-BE-NOTIF-001
• Test Case ID: TC-BE-NOTIF-001
• Test Case Name: Get Unread Notifications and Count
• Purpose/Objective: Verify unread list and count endpoints
• Pre-conditions:
  - User has unread notifications
• Test Steps:
  i. GET /notifications/unread
  ii. GET /notifications/unread-count
• Expected Results:
  - Status 200 for both; list and count returned
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. 200 OK; data returned.

TC-BE-NOTIF-002
• Test Case ID: TC-BE-NOTIF-002
• Test Case Name: Mark Notification as Read
• Purpose/Objective: Verify single mark-as-read
• Pre-conditions:
  - Unread notification exists
• Test Steps:
  i. PATCH /notifications/:id/read
• Expected Results:
  - Status 200; isRead=true
• Dataset Snapshot:
```json
{ "id": "<notification_id>" }
```
• Actual Result: Success. 200 OK; updated.

TC-BE-NOTIF-003
• Test Case ID: TC-BE-NOTIF-003
• Test Case Name: Mark All Notifications as Read
• Purpose/Objective: Verify bulk mark-as-read
• Pre-conditions:
  - User has unread notifications
• Test Steps:
  i. PATCH /notifications/mark-all-read
• Expected Results:
  - Status 200; all marked read
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. 200 OK; all read.

TC-BE-NOTIF-004
• Test Case ID: TC-BE-NOTIF-004
• Test Case Name: Delete Notification
• Purpose/Objective: Verify deletion
• Pre-conditions:
  - Notification exists
• Test Steps:
  i. DELETE /notifications/:id
• Expected Results:
  - Status 200/204; removed
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. Deleted.

TC-BE-MSG-001
• Test Case ID: TC-BE-MSG-001
• Test Case Name: Send Message
• Purpose/Objective: Verify message creation
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. POST /messages with payload
• Expected Results:
  - Status 201; message returned
• Dataset Snapshot:
```json
{ "recipientId": "<user_id>", "content": "Hello" }
```
• Actual Result: Success. 201 Created; message stored.

TC-BE-MSG-002
• Test Case ID: TC-BE-MSG-002
• Test Case Name: List Conversation Messages
• Purpose/Objective: Verify retrieval
• Pre-conditions:
  - Conversation exists
• Test Steps:
  i. GET /messages?conversationId=<id>
• Expected Results:
  - Status 200; ordered messages
• Dataset Snapshot:
```json
{ "conversationId": "<id>" }
```
• Actual Result: Success. 200 OK; messages returned.

---

## Frontend Test Cases (React)

TC-FE-AUTH-001
• Test Case ID: TC-FE-AUTH-001
• Test Case Name: Login Form Validation
• Purpose/Objective: Verify email/password validation prevents invalid submit
• Pre-conditions:
  - App running
• Test Steps:
  i. Open /login
  ii. Enter invalid email
  iii. Submit
• Expected Results:
  - Error shown; no submit
• Dataset Snapshot:
```json
{ "email": "invalid", "password": "x" }
```
• Actual Result: Success. Errors shown.

TC-FE-AUTH-002
• Test Case ID: TC-FE-AUTH-002
• Test Case Name: Login Success
• Purpose/Objective: Verify successful login flow
• Pre-conditions:
  - Valid user exists
• Test Steps:
  i. Fill form; submit
• Expected Results:
  - Navigate to /dashboard; localStorage contains user, token, stream_chat_token
• Dataset Snapshot:
```json
{ "email": "john.doe@example.com", "password": "SecurePass123!" }
```
• Actual Result: Success. Redirected and storage updated.

TC-FE-AUTH-003
• Test Case ID: TC-FE-AUTH-003
• Test Case Name: ProtectedRoute Redirects to Login
• Purpose/Objective: Guard routes when not authenticated
• Pre-conditions:
  - No user in storage
• Test Steps:
  i. Navigate to /dashboard
• Expected Results:
  - Redirect to /login
• Dataset Snapshot:
```json
{ "localStorage.user": null }
```
• Actual Result: Success. Redirected.

TC-FE-SET-001
• Test Case ID: TC-FE-SET-001
• Test Case Name: Profile Update Reflects in Real Time
• Purpose/Objective: Verify UI updates from 'userUpdated' event and storage refresh
• Pre-conditions:
  - Logged in
• Test Steps:
  i. Update profile in Settings → Profile
• Expected Results:
  - Header/Sidebar update immediately; tokens preserved
• Dataset Snapshot:
```json
{ "name": "Jane Updated" }
```
• Actual Result: Success. UI reflected updates instantly.

TC-FE-SET-002
• Test Case ID: TC-FE-SET-002
• Test Case Name: Change Password Success
• Purpose/Objective: Verify success toast and field reset
• Pre-conditions:
  - Logged in
• Test Steps:
  i. Enter current/new/confirm; submit
• Expected Results:
  - Success toast; fields cleared
• Dataset Snapshot:
```json
{ "currentPassword": "SecurePass123!", "newPassword": "NewSecurePass456!", "confirmPassword": "NewSecurePass456!" }
```
• Actual Result: Success. Toast shown; fields cleared.

TC-FE-NOTIF-001
• Test Case ID: TC-FE-NOTIF-001
• Test Case Name: Mark Notification as Read (UI)
• Purpose/Objective: Verify item removal and badge decrement
• Pre-conditions:
  - Unread notifications exist
• Test Steps:
  i. Open dropdown; click check icon
• Expected Results:
  - Item removed; count decreased
• Dataset Snapshot:
```json
{ "notificationId": "<id>" }
```
• Actual Result: Success. Refetched list & count.

TC-FE-NOTIF-002
• Test Case ID: TC-FE-NOTIF-002
• Test Case Name: Mark All Notifications as Read (UI)
• Purpose/Objective: Verify bulk clear
• Pre-conditions:
  - Unread exist
• Test Steps:
  i. Click "Mark all as read"
• Expected Results:
  - List empty; badge cleared
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. All cleared.

TC-FE-SKILLS-001
• Test Case ID: TC-FE-SKILLS-001
• Test Case Name: Add Skill Validation
• Purpose/Objective: Require 5 sub-topics and mandatory fields
• Pre-conditions:
  - Logged in
• Test Steps:
  i. Open Add Skill; submit incomplete
• Expected Results:
  - Validation errors
• Dataset Snapshot:
```json
{ "name": "", "category": "", "subTopics": ["a","b"] }
```
• Actual Result: Success. Errors shown.

TC-FE-SKILLS-002
• Test Case ID: TC-FE-SKILLS-002
• Test Case Name: Add Skill Success
• Purpose/Objective: Verify list refresh & toast
• Pre-conditions:
  - Logged in
• Test Steps:
  i. Submit valid skill
• Expected Results:
  - Toast; list shows new skill
• Dataset Snapshot:
```json
{ "name":"React", "category":"Programming", "proficiency":90, "type":"teaching", "subTopics":["Hooks","Context","Redux","Testing","Perf"] }
```
• Actual Result: Success. Skill added.

TC-FE-SESS-001
• Test Case ID: TC-FE-SESS-001
• Test Case Name: Create Session Validation
• Purpose/Objective: Verify modal validation
• Pre-conditions:
  - Logged in; at least one teachable skill
• Test Steps:
  i. Open Create Session; submit empty
• Expected Results:
  - Errors shown
• Dataset Snapshot:
```json
{ "title": "", "date": "", "startTime": "" }
```
• Actual Result: Success. Errors displayed.

TC-FE-SESS-002
• Test Case ID: TC-FE-SESS-002
• Test Case Name: Create Session Success
• Purpose/Objective: Verify creation flow & UI refresh
• Pre-conditions:
  - Logged in; teachable skill exists
• Test Steps:
  i. Submit valid session
• Expected Results:
  - Toast; sessions grid updated
• Dataset Snapshot:
```json
{ "title":"React 101","date":"2025-08-25","startTime":"10:00","endTime":"11:00","teachSkillId":"<id>" }
```
• Actual Result: Success. Session displayed.

TC-FE-EXREQ-001
• Test Case ID: TC-FE-EXREQ-001
• Test Case Name: Accept Exchange Request (UI)
• Purpose/Objective: Verify PATCH and UI feedback
• Pre-conditions:
  - Pending request exists
• Test Steps:
  i. Click Accept
• Expected Results:
  - Toast; status becomes Accepted; lists refreshed
• Dataset Snapshot:
```json
{ "requestId": "<id>" }
```
• Actual Result: Success. Accepted.

TC-FE-EXREQ-002
• Test Case ID: TC-FE-EXREQ-002
• Test Case Name: Reject Exchange Request (UI)
• Purpose/Objective: Verify reject flow
• Pre-conditions:
  - Pending request exists
• Test Steps:
  i. Click Reject
• Expected Results:
  - Toast; status becomes Rejected
• Dataset Snapshot:
```json
{ "requestId": "<id>" }
```
• Actual Result: Success. Rejected.

TC-FE-EXS-001
• Test Case ID: TC-FE-EXS-001
• Test Case Name: Start/Complete Exchange Session
• Purpose/Objective: Verify status transition buttons
• Pre-conditions:
  - Sessions present
• Test Steps:
  i. Click Start on upcoming; then Complete on ongoing
• Expected Results:
  - Status changes reflected; list refreshes
• Dataset Snapshot:
```json
{ "exchangeSessionId": "<id>" }
```
• Actual Result: Success. Status updated.

TC-FE-MSG-001
• Test Case ID: TC-FE-MSG-001
• Test Case Name: Messages Page Renders & Send Message
• Purpose/Objective: Verify chat UI renders and sending works
• Pre-conditions:
  - stream_chat_token present
• Test Steps:
  i. Open Messages; send a message
• Expected Results:
  - Channel list displayed; message appears in thread
• Dataset Snapshot:
```json
{ "content": "Hello world" }
```
• Actual Result: Success. Message sent and visible.

---

## Python API Test Cases

TC-PY-LLM-001
• Test Case ID: TC-PY-LLM-001
• Test Case Name: LLM Keyword Generation Success
• Purpose/Objective: Verify keywords generated from topic/sub-topics
• Pre-conditions:
  - Python API running
• Test Steps:
  i. POST /api/v1/llm/query with topic and sub_topics
• Expected Results:
  - Status 200; keywords list returned
• Dataset Snapshot:
```json
{ "topic":"JavaScript", "sub_topics":["ES6","React","Node","TS","Testing"] }
```
• Actual Result: Success. Keywords returned.

TC-PY-LLM-002
• Test Case ID: TC-PY-LLM-002
• Test Case Name: LLM Invalid Payload
• Purpose/Objective: Verify validation errors
• Pre-conditions:
  - API running
• Test Steps:
  i. POST /api/v1/llm/query with empty topic
• Expected Results:
  - Status 400; error message
• Dataset Snapshot:
```json
{ "topic":"", "sub_topics":[] }
```
• Actual Result: Success. 400 with validation error.

TC-PY-LLM-003
• Test Case ID: TC-PY-LLM-003
• Test Case Name: LLM Timeout/Error Handling
• Purpose/Objective: Verify robust error handling
• Pre-conditions:
  - API running
• Test Steps:
  i. Simulate upstream timeout/500
• Expected Results:
  - Error response handled; JSON error returned
• Dataset Snapshot:
```json
{ "topic":"Timeout Test", "sub_topics":["slow"] }
```
• Actual Result: Success. Error handled gracefully.

TC-PY-AGENT-001
• Test Case ID: TC-PY-AGENT-001
• Test Case Name: Search Keywords (Pinecone)
• Purpose/Objective: Verify similarity search
• Pre-conditions:
  - Pinecone index populated
• Test Steps:
  i. POST /api/v1/search/keywords with keywords
• Expected Results:
  - Status 200; relevant results
• Dataset Snapshot:
```json
{ "keywords":["javascript","frontend"], "similarity_threshold":0.2, "namespace":"" }
```
• Actual Result: Success. Results returned.

TC-PY-AGENT-002
• Test Case ID: TC-PY-AGENT-002
• Test Case Name: Direct Keyword Search
• Purpose/Objective: Verify direct text retrieval
• Pre-conditions:
  - Index populated
• Test Steps:
  i. POST /api/v1/search/keywords-direct
• Expected Results:
  - Status 200; raw text chunks
• Dataset Snapshot:
```json
{ "keywords":["react","hooks"], "similarity_threshold":0.3, "namespace":"" }
```
• Actual Result: Success. Text returned.


