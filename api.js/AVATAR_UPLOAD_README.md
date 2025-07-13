# Avatar Upload Feature

This feature allows users to upload avatar images during registration using Cloudinary for image storage.

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env.development` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 2. Dependencies

The following packages have been installed:
- `multer` - For handling multipart form data
- `@types/multer` - TypeScript types for multer
- `cloudinary` - For uploading images to Cloudinary

## Usage

### Register with Avatar Upload

**Endpoint:** `POST /auth/register`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `name` (string, required) - User's full name
- `firstName` (string, required) - User's first name
- `lastName` (string, required) - User's last name
- `email` (string, required) - User's email address
- `password` (string, required) - User's password (min 6 characters)
- `bio` (string, optional) - User's bio
- `location` (string, optional) - User's location
- `avatar` (file, optional) - Avatar image file

**File Requirements:**
- Allowed formats: JPEG, JPG, PNG, GIF, WebP
- Maximum size: 5MB

**Example using cURL:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -F "name=John Doe" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "email=john@example.com" \
  -F "password=password123" \
  -F "bio=Software Developer" \
  -F "location=New York" \
  -F "avatar=@/path/to/avatar.jpg"
```

**Example using JavaScript/Fetch:**

```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('firstName', 'John');
formData.append('lastName', 'Doe');
formData.append('email', 'john@example.com');
formData.append('password', 'password123');
formData.append('bio', 'Software Developer');
formData.append('location', 'New York');

// Add avatar file if available
const avatarFile = document.getElementById('avatar').files[0];
if (avatarFile) {
  formData.append('avatar', avatarFile);
}

const response = await fetch('/auth/register', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
```

## Response

**Success Response (201):**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "bio": "Software Developer",
    "location": "New York",
    "avatar": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/skillswap-avatars/avatar.jpg",
    "status": "offline",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Invalid file type or size
- **409 Conflict** - Email already exists
- **500 Internal Server Error** - Upload failed or other server error

## Implementation Details

### Files Modified/Created:

1. **`src/Modules/common/cloudinary.service.ts`** - Cloudinary upload service
2. **`src/Modules/auth/auth.controller.ts`** - Updated register endpoint with file upload
3. **`src/Modules/auth/auth.service.ts`** - Added file validation and Cloudinary integration
4. **`src/Modules/auth/auth.module.ts`** - Added CloudinaryService to providers
5. **`src/Modules/user/dto/create-user.dto.ts`** - Added avatar field
6. **`src/config/configuration.ts`** - Added Cloudinary configuration

### Features:

- ✅ File type validation (JPEG, JPG, PNG, GIF, WebP)
- ✅ File size validation (5MB limit)
- ✅ Cloudinary integration for image storage
- ✅ Automatic folder organization (`skillswap-avatars`)
- ✅ Fallback to default avatar if no file provided
- ✅ Error handling for upload failures 