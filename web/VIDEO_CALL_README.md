# Video Call Feature Implementation

This document describes the video call feature implementation using VideoSDK Live React SDK.

## Overview

The video call feature allows users to:
- Create new video meetings
- Join existing meetings using meeting IDs
- Participate in real-time video calls with multiple participants
- Control microphone and camera settings
- Share meeting information

## Components

### 1. VideoCall Component (`web/src/components/video/VideoCall.tsx`)

Main component that handles:
- Meeting creation and joining
- Video call interface
- Participant management
- Controls (mic, camera, leave)

### 2. VideoService (`web/src/lib/videoService.ts`)

Service layer for:
- Token generation
- Meeting ID validation
- VideoSDK configuration

## Features

### ✅ Implemented Features

1. **Meeting Management**
   - Create new meetings with auto-generated IDs
   - Join existing meetings with meeting ID
   - Meeting ID validation

2. **Video Interface**
   - Multi-participant video grid
   - Responsive layout (1-3 columns based on screen size)
   - Participant avatars when camera is off
   - Local participant indicator

3. **Controls**
   - Microphone toggle (mute/unmute)
   - Camera toggle (on/off)
   - Leave meeting
   - Copy meeting ID
   - Share meeting

4. **UI/UX**
   - Clean, modern interface
   - Toast notifications for user feedback
   - Loading states
   - Error handling

### 🔧 Technical Implementation

1. **VideoSDK Integration**
   - Uses `@videosdk.live/react-sdk`
   - MeetingProvider for context management
   - useMeeting and useParticipant hooks

2. **State Management**
   - React hooks for local state
   - VideoSDK hooks for meeting state
   - Toast notifications for user feedback

3. **Styling**
   - Tailwind CSS for styling
   - Responsive design
   - Dark/light theme support

## Setup Instructions

### 1. Environment Variables

Add these to your `.env` file:

```env
VITE_VIDEO_SDK_API_KEY=your_videosdk_api_key
VITE_VIDEO_SDK_SECRET_KEY=your_videosdk_secret_key
```

### 2. Backend Integration

For production use, implement token generation on your backend:

```javascript
// Example backend endpoint (Node.js/Express)
app.post('/api/video/token', async (req, res) => {
  try {
    const { meetingId } = req.body;
    
    // Generate token using VideoSDK
    const token = await VideoSDK.generateToken({
      room: meetingId,
      participant: req.user.id,
      permissions: {
        canJoin: true,
        canModerate: true,
      },
    });
    
    res.json({ token, meetingId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate token' });
  }
});
```

### 3. Update VideoService

Replace the mock token generation in `VideoService.generateToken()` with actual API calls to your backend.

## Usage

### For Users

1. **Create a Meeting**
   - Navigate to "Video Call" in the sidebar
   - Click "Create Meeting"
   - Share the generated meeting ID with others

2. **Join a Meeting**
   - Navigate to "Video Call" in the sidebar
   - Enter the meeting ID
   - Click "Join Meeting"

3. **During Call**
   - Use microphone button to mute/unmute
   - Use camera button to turn camera on/off
   - Use "Copy ID" to share meeting ID
   - Use "Share" to share meeting link
   - Use "Leave" to end the call

### For Developers

1. **Adding to Sidebar**
   - The "Video Call" tab is already added to the sidebar
   - Uses `IconVideo` from Tabler Icons

2. **Routing**
   - Route: `/video-call`
   - Component: `VideoCall`
   - Added to `AppLayout.tsx`

3. **Customization**
   - Modify `VideoCall.tsx` for UI changes
   - Update `VideoService.ts` for backend integration
   - Customize styling in the component

## Current Limitations

1. **Demo Mode**
   - Currently uses mock tokens for demonstration
   - Requires backend integration for production use

2. **Features Not Implemented**
   - Screen sharing
   - Chat functionality
   - Recording
   - Meeting scheduling
   - Participant management (kick, mute others)

## Future Enhancements

1. **Advanced Features**
   - Screen sharing
   - Chat during calls
   - Meeting recording
   - Virtual backgrounds
   - Meeting scheduling

2. **Integration**
   - Connect with session management
   - User authentication
   - Meeting history
   - Analytics

3. **UI Improvements**
   - Picture-in-picture mode
   - Fullscreen support
   - Custom themes
   - Accessibility improvements

## Troubleshooting

### Common Issues

1. **Token Generation Fails**
   - Check environment variables
   - Verify VideoSDK API credentials
   - Check network connectivity

2. **Video Not Working**
   - Check browser permissions
   - Ensure HTTPS in production
   - Verify camera/microphone access

3. **Meeting Join Fails**
   - Verify meeting ID format
   - Check if meeting exists
   - Ensure proper token generation

### Debug Mode

Enable debug logging by adding to your environment:

```env
VITE_VIDEO_DEBUG=true
```

## Dependencies

- `@videosdk.live/react-sdk` - Video call functionality
- `lucide-react` - Icons
- `@/hooks/use-toast` - Toast notifications
- `@/components/ui/*` - UI components

## Support

For VideoSDK Live support:
- [VideoSDK Documentation](https://docs.videosdk.live/)
- [VideoSDK React SDK](https://www.npmjs.com/package/@videosdk.live/react-sdk)
- [VideoSDK Community](https://community.videosdk.live/)
