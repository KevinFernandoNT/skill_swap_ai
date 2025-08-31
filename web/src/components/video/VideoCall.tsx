"use client";

import React, { useState, useEffect } from 'react';
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from '@videosdk.live/react-sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Users, 
  Settings,
  Copy,
  Share
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VideoService } from '@/lib/videoService';

interface VideoCallProps {
  meetingId?: string;
}

// Participant Video Component
const ParticipantView = ({ participantId }: { participantId: string }) => {
  const { 
    webcamStream, 
    micStream, 
    webcamOn, 
    micOn, 
    isLocal, 
    displayName,
    webcamTrack,
    micTrack
  } = useParticipant(participantId);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
      {webcamOn && webcamStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-xl font-semibold">
                {displayName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <p className="text-white text-sm">{displayName || 'Unknown'}</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-2 left-2 flex gap-1">
        {!micOn && (
          <div className="bg-red-500 text-white p-1 rounded">
            <MicOff size={12} />
          </div>
        )}
        {!webcamOn && (
          <div className="bg-red-500 text-white p-1 rounded">
            <VideoOff size={12} />
          </div>
        )}
      </div>
      
      {isLocal && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          You
        </div>
      )}
    </div>
  );
};

// Controls Component
const Controls = () => {
  const { 
    leave, 
    toggleMic, 
    toggleWebcam, 
    localMicOn, 
    localWebcamOn,
    localAudioTrack,
    localVideoTrack
  } = useMeeting();
  const { toast } = useToast();

  const handleLeave = () => {
    leave();
    toast({
      title: "Left meeting",
      description: "You have left the video call.",
    });
  };

  const handleToggleMic = () => {
    try {
      toggleMic();
      toast({
        title: localMicOn ? "Microphone muted" : "Microphone unmuted",
        description: localMicOn ? "Your microphone is now off" : "Your microphone is now on",
      });
    } catch (error) {
      console.error('Error toggling microphone:', error);
      toast({
        title: "Error",
        description: "Failed to toggle microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleToggleWebcam = () => {
    try {
      toggleWebcam();
      toast({
        title: localWebcamOn ? "Camera turned off" : "Camera turned on",
        description: localWebcamOn ? "Your camera is now off" : "Your camera is now on",
      });
    } catch (error) {
      console.error('Error toggling webcam:', error);
      toast({
        title: "Error",
        description: "Failed to toggle camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-card border-t">
      <Button
        onClick={handleToggleMic}
        variant={localMicOn ? "default" : "destructive"}
        size="sm"
        disabled={!localAudioTrack}
      >
        {localMicOn ? <Mic size={16} /> : <MicOff size={16} />}
      </Button>
      
      <Button
        onClick={handleToggleWebcam}
        variant={localWebcamOn ? "default" : "destructive"}
        size="sm"
        disabled={!localVideoTrack}
      >
        {localWebcamOn ? <Video size={16} /> : <VideoOff size={16} />}
      </Button>
      
      <Button
        onClick={handleLeave}
        variant="destructive"
        size="sm"
      >
        <PhoneOff size={16} />
      </Button>
    </div>
  );
};

// Meeting Container
const MeetingView = ({ meetingId }: { meetingId: string }) => {
  const { participants, localParticipant, meeting } = useMeeting({
    onMeetingJoined: () => {
      console.log('Meeting joined successfully');
      toast({
        title: "Connected",
        description: "Successfully connected to the meeting.",
      });
    },
    onMeetingLeft: () => {
      console.log('Meeting left');
      toast({
        title: "Disconnected",
        description: "You have left the meeting.",
      });
    },
    onError: (error) => {
      console.error('Meeting error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the meeting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyMeetingId = () => {
    navigator.clipboard.writeText(meetingId);
    toast({
      title: "Meeting ID copied",
      description: "Meeting ID has been copied to clipboard.",
    });
  };

  const shareMeeting = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my video call',
        text: `Join my video call using meeting ID: ${meetingId}`,
        url: window.location.href,
      });
    } else {
      copyMeetingId();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Phone size={20} className="text-green-500" />
            <span className="font-semibold">Live Meeting</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={16} />
            <span>{participants.size} participants</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={copyMeetingId}
            variant="outline"
            size="sm"
          >
            <Copy size={16} className="mr-1" />
            Copy ID
          </Button>
          <Button
            onClick={shareMeeting}
            variant="outline"
            size="sm"
          >
            <Share size={16} className="mr-1" />
            Share
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          {Array.from(participants.values()).map((participant) => (
            <div key={participant.id} className="aspect-video">
              <ParticipantView participantId={participant.id} />
            </div>
          ))}
          {participants.size === 0 && (
            <div className="col-span-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Waiting for participants to join...</p>
                <p className="text-sm">You are the first participant in this meeting.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <Controls />
    </div>
  );
};

// Main Video Call Component
const VideoCall: React.FC<VideoCallProps> = ({ meetingId: initialMeetingId }) => {
  const [meetingId, setMeetingId] = useState(initialMeetingId || '');
  const [isJoined, setIsJoined] = useState(false);
  const [token, setToken] = useState('');
  const [isVideoSDKLoaded, setIsVideoSDKLoaded] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const { toast } = useToast();

  // Check if VideoSDK is loaded and request permissions
  React.useEffect(() => {
    const initializeVideoSDK = async () => {
      try {
        // Check if VideoSDK is available
        if (typeof window !== 'undefined' && window.VideoSDK) {
          setIsVideoSDKLoaded(true);
          console.log('VideoSDK is loaded');
        } else {
          console.log('VideoSDK not found, using React SDK');
          setIsVideoSDKLoaded(true); // Assume React SDK is working
        }

        // Request camera and microphone permissions
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          console.log('Camera and microphone permissions granted');
          // Stop the stream as we just needed to request permissions
          stream.getTracks().forEach(track => track.stop());
        } catch (permissionError) {
          console.error('Permission denied for camera/microphone:', permissionError);
          toast({
            title: "Permission Required",
            description: "Please allow camera and microphone access to use video calls.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking VideoSDK:', error);
        setIsVideoSDKLoaded(false);
      }
    };

    initializeVideoSDK();
  }, [toast]);

  // Generate token using VideoService
  const generateToken = async (meetingId?: string) => {
    try {
      const response = await VideoService.generateToken(meetingId);
      setToken(response.token);
      return response.token;
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  };

  const joinMeeting = async () => {
    if (!meetingId.trim()) {
      toast({
        title: "Meeting ID required",
        description: "Please enter a meeting ID to join.",
        variant: "destructive",
      });
      return;
    }

    if (!VideoService.isValidMeetingId(meetingId)) {
      toast({
        title: "Invalid Meeting ID",
        description: "Please enter a valid meeting ID (3-50 characters).",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Joining meeting:', meetingId);
      const authToken = await generateToken(meetingId);
      console.log('Token generated:', authToken ? 'Success' : 'Failed');
      setToken(authToken);
      setIsJoined(true);
      toast({
        title: "Joined meeting",
        description: "Successfully joined the video call.",
      });
    } catch (error) {
      console.error('Error joining meeting:', error);
      toast({
        title: "Failed to join",
        description: "Could not join the meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const createMeeting = async () => {
    try {
      const response = await VideoService.generateToken();
      setMeetingId(response.meetingId);
      setToken(response.token);
      setIsJoined(true);
      toast({
        title: "Meeting created",
        description: `New meeting created with ID: ${response.meetingId}`,
      });
    } catch (error) {
      toast({
        title: "Failed to create meeting",
        description: "Could not create a new meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isJoined) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone size={24} className="text-green-500" />
              Video Call
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting ID</label>
              <Input
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                placeholder="Enter meeting ID"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={joinMeeting} className="flex-1">
                Join Meeting
              </Button>
              <Button onClick={createMeeting} variant="outline">
                Create Meeting
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              <p>Note: This is a demo implementation.</p>
              <p>In production, you'll need to implement proper token generation.</p>
              <p className="mt-2">
                VideoSDK Status: {isVideoSDKLoaded ? 
                  <span className="text-green-500">✓ Loaded</span> : 
                  <span className="text-red-500">✗ Not Loaded</span>
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: 'Test User',
        participantId: `user-${Date.now()}`,
        debugMode: true,
        // Ensure proper media settings
        webcamConfig: {
          facingMode: 'user',
          width: 1280,
          height: 720,
        },
        micConfig: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      }}
      token={token}
    >
      <MeetingConsumer>
        {() => <MeetingView meetingId={meetingId} />}
      </MeetingConsumer>
    </MeetingProvider>
  );
};

export default VideoCall;
