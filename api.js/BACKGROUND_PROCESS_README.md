# Background Process Feature Documentation

## Overview

This feature implements a background process that automatically sends session data to the Python API when a new session is created. The process runs asynchronously and does not block the session creation request.

## How It Works

1. **Session Creation**: When a user creates a new session through the `/sessions` POST endpoint
2. **Data Extraction**: The system extracts the `teachSkillId` and `focusKeywords` from the session data
3. **Skill Lookup**: The system queries the database to get the skill name using the `teachSkillId`
4. **Background Process**: A background process is triggered that sends the data to the Python API
5. **API Call**: The background process makes an HTTP POST request to the Python API at `http://127.0.0.1:5000/api/v1/llm/query`

## API Flow

### Request to NestJS API
```bash
POST /sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "React Hooks Masterclass",
  "description": "Learn React Hooks in depth",
  "teachSkillId": "60d5ec49f1b2c8b1f8e4f1a1",
  "focusKeywords": ["useState", "useEffect", "custom hooks"],
  "date": "2024-01-15",
  "startTime": "14:00",
  "endTime": "16:00",
  "skillCategory": "Programming",
  "isTeaching": true,
  "isPublic": true,
  "maxParticipants": 10
}
```

### Background Process to Python API
```bash
POST http://127.0.0.1:5000/api/v1/llm/query
Content-Type: application/json

{
  "topic": "React Development",
  "sub_topics": ["useState", "useEffect", "custom hooks"]
}
```

## Prerequisites

1. **Python API**: The Python API must be running on `http://127.0.0.1:5000`
2. **Dependencies**: Make sure to install the required dependencies:
   ```bash
   npm install @nestjs/axios axios
   ```
3. **Skill Data**: The session must include a valid `teachSkillId` that exists in the skills collection
4. **Focus Keywords**: The session should include at least one focus keyword

## Testing the Feature

### 1. Start the Python API
```bash
cd api.py
python src/main.py
```

### 2. Start the NestJS API
```bash
cd api.js
npm run start:dev
```

### 3. Create a Skill First
```bash
POST /skills
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "React Development",
  "category": "Programming",
  "type": "teaching",
  "proficiency": 85,
  "description": "Advanced React development skills"
}
```

### 4. Create a Session
Use the skill ID from step 3 as the `teachSkillId` in your session creation request.

## Logging

The feature includes comprehensive logging at multiple levels:

### SessionsController Logs
- Logs incoming session creation requests
- Logs request completion

### SessionsService Logs
- Logs session creation process
- Logs background process trigger decisions
- Logs skill lookup results
- Logs background process execution

### ExternalHttpService Logs
- Logs API request initiation
- Logs request payload
- Logs response data
- Logs error details

### Example Log Output
```
[SessionsController] Received session creation request from user: 60d5ec49f1b2c8b1f8e4f1a1
[SessionsController] Request body: {"title":"React Hooks Masterclass",...}
[SessionsService] Creating new session for user: 60d5ec49f1b2c8b1f8e4f1a1
[SessionsService] Session created successfully with ID: 60d5ec49f1b2c8b1f8e4f1a2
[SessionsService] Triggering background process for session: 60d5ec49f1b2c8b1f8e4f1a2
[SessionsService] Starting background process execution
[SessionsService] Fetching skill data for ID: 60d5ec49f1b2c8b1f8e4f1a1
[SessionsService] Skill found: React Development (Category: Programming)
[SessionsService] Executing background process to Python API
[ExternalHttpService] Starting background process to send session data to Python API
[ExternalHttpService] Sending request to Python API: http://127.0.0.1:5000/api/v1/llm/query
[ExternalHttpService] Response received successfully
[SessionsService] Background process initiated successfully
[SessionsController] Session creation completed successfully
```

## Error Handling

The background process includes robust error handling:

1. **Skill Not Found**: If the `teachSkillId` doesn't exist, the process logs an error and stops
2. **Python API Unavailable**: If the Python API is down, the error is logged but doesn't affect session creation
3. **Network Timeouts**: 30-second timeout with proper error logging
4. **Invalid Responses**: All error responses are logged with details

## Configuration

### Environment Variables
You can customize the Python API URL by modifying the `pythonApiBaseUrl` in `ExternalHttpService`:

```typescript
private readonly pythonApiBaseUrl = process.env.PYTHON_API_URL || 'http://127.0.0.1:5000/api/v1';
```

### Timeout Configuration
The HTTP timeout can be adjusted in the `sendSessionToPythonApi` method:

```typescript
timeout: 30000, // 30 second timeout
```

## Monitoring

To monitor the background process:

1. **Check Logs**: Monitor the application logs for background process execution
2. **Python API Logs**: Check the Python API logs to ensure requests are being received
3. **Database**: Verify that sessions are being created successfully regardless of background process status

## Troubleshooting

### Common Issues

1. **Background Process Not Triggered**
   - Ensure `teachSkillId` is provided and valid
   - Ensure `focusKeywords` array is not empty

2. **Python API Not Receiving Requests**
   - Check if Python API is running on the correct port
   - Verify the URL in the `ExternalHttpService`
   - Check network connectivity

3. **Skill Not Found Errors**
   - Verify the `teachSkillId` exists in the skills collection
   - Check that the skill belongs to the user creating the session

4. **Timeout Errors**
   - Increase the timeout value if the Python API is slow
   - Check Python API performance and response times 