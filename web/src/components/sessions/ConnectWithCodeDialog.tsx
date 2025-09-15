import React, { useState } from 'react';
import { Key, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Session } from '../../types';

interface ConnectWithCodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSessionFound: (session: Session) => void;
}

const ConnectWithCodeDialog: React.FC<ConnectWithCodeDialogProps> = ({
  isOpen,
  onOpenChange,
  onSessionFound
}) => {
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [isSearchingCode, setIsSearchingCode] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length < 4) return;
    
    setPinError('');
    setIsSearchingCode(true);
    
    try {
      const baseURL = import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/api';
      const res = await fetch(`${baseURL}/sessions/code/${encodeURIComponent(pinCode)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await res.json();
      const session = data?.data as any;
      
      if (session) {
        // Normalize to frontend Session shape minimally required for modals
        const normalized: Session = {
          _id: session._id,
          title: session.title,
          date: session.date,
          startTime: session.startTime,
          endTime: session.endTime,
          skillCategory: session.skillCategory,
          participant: session.participants?.[0] || session.hostId, // placeholder usage
          hostId: session.hostId,
          status: session.status,
          isTeaching: session.isTeaching,
          description: session.description,
          maxParticipants: session.maxParticipants,
          isPublic: session.isPublic,
          teachSkillId: session.teachSkillId,
          teachSkillName: session.teachSkillName,
          meetingLink: session.meetingLink,
          focusKeywords: session.focusKeywords,
          metadata: session.metadata,
        } as Session;

        onSessionFound(normalized);
        handleClose();
        
        toast({
          title: "Session Found",
          description: "Successfully found the session with the provided code!"
        });
      } else {
        setPinError('No session matched that code.');
      }
    } catch (e: any) {
      setPinError(e?.message || 'Failed to search by code.');
    } finally {
      setIsSearchingCode(false);
    }
  };

  const handleClose = () => {
    setPinCode('');
    setPinError('');
    setIsSearchingCode(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Connect using code
            </DialogTitle>
            <DialogDescription>
              Enter the PIN code provided by the session host to join their private session.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="pin-code">PIN Code</Label>
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={4} 
                  value={pinCode}
                  onChange={setPinCode}
                  disabled={isSearchingCode}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {pinError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  {pinError}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSearchingCode}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={pinCode.length < 4 || isSearchingCode}
              className="bg-primary hover:bg-primary/90"
            >
              {isSearchingCode ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWithCodeDialog;
