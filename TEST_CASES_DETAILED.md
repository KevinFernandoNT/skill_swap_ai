## Backend Test Cases (NestJS API)

TC-BE-AUTH-001
• Test Case ID: TC-BE-AUTH-001
• Test Case Name: User Registration with Valid Data
• Purpose/Objective: Verify that a new user can be registered successfully with valid information
• Pre-conditions:
  - Backend server is running
  - Database connection is established
  - File storage configuration available (for avatar)
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
• Actual Result: Success. Status 201; response returned created user (without password). DB row present; password hashed; avatar uploaded when supplied.

TC-BE-AUTH-002
• Test Case ID: TC-BE-AUTH-002
• Test Case Name: User Login with Valid Credentials
• Purpose/Objective: Verify that users can log in with correct credentials
• Pre-conditions:
  - Backend server is running
  - Registered user exists
• Test Steps:
  i. Send POST request to /auth/login
  ii. Include valid email and password
  iii. Verify response
• Expected Results:
  - Status code: 200
  - Response contains access_token, user, stream_chat_token
• Dataset Snapshot:
```json
{ "email": "john.doe@example.com", "password": "SecurePass123!" }
```
• Actual Result: Success. Status 200; access_token, user and stream_chat_token returned.

TC-BE-USER-001
• Test Case ID: TC-BE-USER-001
• Test Case Name: Get Current User Profile
• Purpose/Objective: Verify that authenticated users can retrieve their profile
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. Send GET /users/profile with Authorization: Bearer <token>
  ii. Verify response
• Expected Results:
  - Status 200
  - Profile returned without password
• Dataset Snapshot:
```json
{ "Authorization": "Bearer <valid_jwt>" }
```
• Actual Result: Success. Status 200; user profile returned without password.

TC-BE-USER-002
• Test Case ID: TC-BE-USER-002
• Test Case Name: Update User Profile
• Purpose/Objective: Verify profile update and persistence
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. Send PUT /users/profile with form-data (fields + optional avatar)
  ii. Verify response and persistence
• Expected Results:
  - Status 200
  - Updated fields returned and saved
• Dataset Snapshot:
```json
{ "name": "John Updated Doe", "location": "Seattle, WA", "bio": "Updated bio" }
```
• Actual Result: Success. Status 200; fields updated and persisted.

TC-BE-USER-003
• Test Case ID: TC-BE-USER-003
• Test Case Name: Change Password with Current Password
• Purpose/Objective: Verify password change flow using current password
• Pre-conditions:
  - Valid JWT
  - User knows current password
• Test Steps:
  i. Send PUT /users/change-password with { currentPassword, newPassword }
  ii. Verify response
  iii. Attempt login with new password
• Expected Results:
  - Status 200
  - Password updated (hashed)
  - Login succeeds with new password
• Dataset Snapshot:
```json
{ "currentPassword": "SecurePass123!", "newPassword": "NewSecurePass456!" }
```
• Actual Result: Success. Status 200; login with new password works.

TC-BE-NOTIF-001
• Test Case ID: TC-BE-NOTIF-001
• Test Case Name: Get Unread Notifications and Count
• Purpose/Objective: Verify retrieval of unread notifications and count
• Pre-conditions:
  - Valid JWT
  - User has unread notifications
• Test Steps:
  i. GET /notifications/unread
  ii. GET /notifications/unread-count
• Expected Results:
  - Status 200 for both
  - Data returns arrays and numeric count
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. Unread list and count returned.

TC-BE-NOTIF-002
• Test Case ID: TC-BE-NOTIF-002
• Test Case Name: Mark Notification as Read
• Purpose/Objective: Verify single notification can be marked read
• Pre-conditions:
  - Valid JWT
  - An unread notification exists
• Test Steps:
  i. PATCH /notifications/:id/read
  ii. Verify subsequent unread list/count
• Expected Results:
  - Status 200
  - isRead=true for that id
  - Unread count decrements
• Dataset Snapshot:
```json
{ "id": "<notification_id>" }
```
• Actual Result: Success. Notification marked read; count decremented.

TC-BE-NOTIF-003
• Test Case ID: TC-BE-NOTIF-003
• Test Case Name: Mark All Notifications as Read
• Purpose/Objective: Verify bulk mark-as-read
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. PATCH /notifications/mark-all-read
  ii. Verify unread list/count
• Expected Results:
  - Status 200
  - All isRead=true; count=0
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. All notifications marked read; count=0.

TC-BE-SKILLS-001
• Test Case ID: TC-BE-SKILLS-001
• Test Case Name: Create Skill with Metadata
• Purpose/Objective: Verify skill creation and metadata handling
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. POST /skills with required fields
  ii. Verify response and persistence
• Expected Results:
  - Status 201
  - Skill stored with provided fields
• Dataset Snapshot:
```json
{ "name": "React", "category": "Programming", "proficiency": 85, "type": "teaching", "subTopics": ["Hooks","State","Routing","Context","Testing"] }
```
• Actual Result: Success. Skill created and returned.

TC-BE-SKILLS-002
• Test Case ID: TC-BE-SKILLS-002
• Test Case Name: Get User Skills
• Purpose/Objective: Verify retrieval of skills for current user
• Pre-conditions:
  - Valid JWT
  - User has skills
• Test Steps:
  i. GET /skills
• Expected Results:
  - Status 200
  - Array of skills returned
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. Skills list returned.

TC-BE-SESS-001
• Test Case ID: TC-BE-SESS-001
• Test Case Name: Create Session
• Purpose/Objective: Verify session creation and background process
• Pre-conditions:
  - Valid JWT
  - User has teachable skills
• Test Steps:
  i. POST /sessions with required fields
  ii. Verify response
• Expected Results:
  - Status 201
  - Session stored; metadata fields accepted
• Dataset Snapshot:
```json
{ "title":"React Hooks", "date":"2025-08-20", "startTime":"10:00", "endTime":"11:00", "skillCategory":"Programming", "isTeaching":true, "teachSkillId":"<skill_id>", "subTopics":["Hooks","Effects","Memo"], "focusKeywords":["react","hooks"] }
```
• Actual Result: Success. Session created.

TC-BE-SESS-002
• Test Case ID: TC-BE-SESS-002
• Test Case Name: Get Upcoming Sessions (Dashboard)
• Purpose/Objective: Verify retrieval of upcoming sessions range
• Pre-conditions:
  - Valid JWT
• Test Steps:
  i. GET /exchange-sessions/upcoming-dashboard
• Expected Results:
  - Status 200
  - Paginated result with upcoming sessions next 3 days
• Dataset Snapshot:
```json
{}
```
• Actual Result: Success. Upcoming sessions returned.

TC-BE-EXREQ-001
• Test Case ID: TC-BE-EXREQ-001
• Test Case Name: Create Exchange Request
• Purpose/Objective: Verify creation of exchange request
• Pre-conditions:
  - Valid JWT
  - Session exists
  - Offered and requested skills exist
• Test Steps:
  i. POST /exchange-requests with sessionId, recipient, offeredSkillId, requestedSkillId
• Expected Results:
  - Status 201
  - Request stored with status=pending
• Dataset Snapshot:
```json
{ "sessionId":"<session_id>", "recipient":"<user_id>", "offeredSkillId":"<skill_id>", "requestedSkillId":"<skill_id>" }
```
• Actual Result: Success. Exchange request created.

TC-BE-EXREQ-002
• Test Case ID: TC-BE-EXREQ-002
• Test Case Name: Accept Exchange Request → Creates Exchange Session + Notification
• Purpose/Objective: Verify side-effects on acceptance
• Pre-conditions:
  - Valid JWT of recipient/host
  - Pending request exists
• Test Steps:
  i. PATCH /exchange-requests/:id with { status: "accepted" }
  ii. Verify notification to requester
  iii. Verify exchange session created with hostId=recipient, requestedBy=requester, skillId/requestedSkillId mapped
• Expected Results:
  - Status 200
  - Notification created
  - Exchange session created
• Dataset Snapshot:
```json
{ "status": "accepted" }
```
• Actual Result: Success. Notification stored; exchange session created.

TC-BE-EXS-001
• Test Case ID: TC-BE-EXS-001
• Test Case Name: Start Exchange Session
• Purpose/Objective: Verify session can transition to ongoing
• Pre-conditions:
  - Valid JWT as host or requestedBy
  - Exchange session exists with status=upcoming
• Test Steps:
  i. PATCH /exchange-sessions/:id/start
• Expected Results:
  - Status 200
  - status=ongoing
• Dataset Snapshot:
```json
{ "id": "<exchange_session_id>" }
```
• Actual Result: Success. Status updated to ongoing.

TC-BE-EXS-002
• Test Case ID: TC-BE-EXS-002
• Test Case Name: Complete Exchange Session
• Purpose/Objective: Verify session can transition to completed
• Pre-conditions:
  - Valid JWT as host or requestedBy
  - status=ongoing
• Test Steps:
  i. PATCH /exchange-sessions/:id/complete
• Expected Results:
  - Status 200
  - status=completed
• Dataset Snapshot:
```json
{ "id": "<exchange_session_id>" }
```
• Actual Result: Success. Status updated to completed.

TC-BE-EXS-003
• Test Case ID: TC-BE-EXS-003
• Test Case Name: Expire Missed Upcoming Sessions (Cron)
• Purpose/Objective: Verify daily cron marks overdue upcoming sessions as expired
• Pre-conditions:
  - Session exists with date/time in past and status=upcoming
• Test Steps:
  i. Trigger cron (or call service method) to expire
  ii. Verify affected sessions have status=expired
• Expected Results:
  - Pending sessions past start are marked expired
• Dataset Snapshot:
```json
{ "date": "<yesterday>", "startTime": "09:00", "status": "upcoming" }
```
• Actual Result: Success. Overdue sessions set to expired.

TC-BE-MSG-001
• Test Case ID: TC-BE-MSG-001
• Test Case Name: Send Message in Conversation
• Purpose/Objective: Verify sending a message
• Pre-conditions:
  - Valid JWT
  - Conversation exists (or will be created)
• Test Steps:
  i. POST /messages with recipient and content
• Expected Results:
  - Status 201
  - Message stored and retrievable
• Dataset Snapshot:
```json
{ "recipientId": "<user_id>", "content": "Hello there!" }
```
• Actual Result: Success. Message created and returned in conversation.

---

## Frontend Test Cases (React)

TC-FE-SET-001
• Test Case ID: TC-FE-SET-001
• Test Case Name: Profile Update Reflects in Real Time
• Purpose/Objective: Verify profile updates trigger localStorage refresh and UI event broadcast
• Pre-conditions:
  - User logged in
• Test Steps:
  i. Open Settings → Profile
  ii. Update fields and save
  iii. Observe header/sidebar update without reload
• Expected Results:
  - Local storage user replaced (token and stream_chat_token preserved)
  - 'userUpdated' event dispatched and UI updates immediately
• Dataset Snapshot:
```json
{ "name": "Jane Updated" }
```
• Actual Result: Success. UI updated instantly and tokens preserved.

TC-FE-NOTIF-001
• Test Case ID: TC-FE-NOTIF-001
• Test Case Name: Mark Notification as Read from UI
• Purpose/Objective: Verify UI button marks notification as read
• Pre-conditions:
  - Logged in; unread exists
• Test Steps:
  i. Open notifications dropdown
  ii. Click check icon
  iii. Verify item disappears and badge decrements
• Expected Results:
  - API PATCH success; UI reflects change
• Dataset Snapshot:
```json
{ "notificationId": "<id>" }
```
• Actual Result: Success. Notification removed; count decreased.

TC-FE-EXS-001
• Test Case ID: TC-FE-EXS-001
• Test Case Name: Start/Complete Exchange Session from Page
• Purpose/Objective: Verify buttons start and complete sessions
• Pre-conditions:
  - User has exchange sessions
• Test Steps:
  i. Open Exchange Sessions page
  ii. Click "Start Session" for upcoming
  iii. Click "Complete Session" for ongoing
• Expected Results:
  - Status transitions ongoing → completed reflected in UI
• Dataset Snapshot:
```json
{ "exchangeSessionId": "<id>" }
```
• Actual Result: Success. Buttons worked; UI refreshed.


