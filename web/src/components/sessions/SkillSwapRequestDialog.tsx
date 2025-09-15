import React, { useState } from 'react';
import { ArrowRightLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { SuggestedSession } from '../../hooks/useGetSuggestedSessions';
import { useGetUserSkills } from '../../hooks/useGetUserSkills';
import { useCreateExchangeRequest } from '../../hooks/useCreateExchangeRequest';
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
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { Skill } from '../../types';

interface SkillSwapRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  session: SuggestedSession | null;
}

const SkillSwapRequestDialog: React.FC<SkillSwapRequestDialogProps> = ({
  isOpen,
  onOpenChange,
  session
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [message, setMessage] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const { toast } = useToast();

  // Fetch user skills from API
  const { data: userSkillsResponse, isLoading: isLoadingSkills } = useGetUserSkills();
  const userSkills: Skill[] = userSkillsResponse?.data || [];

  // Filter user's teaching skills
  const availableSkills = userSkills.filter(skill => 
    skill.type === 'teaching'
  );

  const selectedSkill = availableSkills.find(skill => skill._id === selectedSkillId);

  // Create exchange request hook
  const { mutate: createExchangeRequest, status: createStatus } = useCreateExchangeRequest({
    onSuccess: () => {
      toast({
        title: "Swap Request Sent",
        description: "Your skill swap request has been sent successfully!"
      });
      // Reset form
      setSelectedSkillId('');
      setMessage('');
      setMeetingLink('');
      setShowConfirmation(false);
      setPendingFormData(null);
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Swap Request Failed",
        description: error?.response?.data?.message || "Could not send swap request.",
        variant: "destructive",
      });
      setShowConfirmation(false);
      setPendingFormData(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId || !session) return;
    
    // Get the session skill ID from the teachSkillId array
    const sessionSkillId = session.teachSkillId && session.teachSkillId.length > 0 
      ? session.teachSkillId[0]._id 
      : null;
    
    if (!sessionSkillId) {
      toast({
        title: "Error",
        description: "Session skill not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Store form data and show confirmation
    setPendingFormData({
      sessionId: session._id,
      recipient: session.hostId._id,
      offeredSkillId: selectedSkillId,
      requestedSkillId: sessionSkillId,
      message: message.trim() || undefined,
      meetingLink: meetingLink.trim() || undefined
    });
    setShowConfirmation(true);
  };

  const handleConfirmRequest = () => {
    if (!pendingFormData) return;
    createExchangeRequest(pendingFormData);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setPendingFormData(null);
  };

  const handleClose = () => {
    setSelectedSkillId('');
    setMessage('');
    setMeetingLink('');
    setShowConfirmation(false);
    setPendingFormData(null);
    onOpenChange(false);
  };

  if (!session) return null;

  const isSubmitting = createStatus === 'pending';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {!showConfirmation ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5" />
                Request Skill Swap
              </DialogTitle>
              <DialogDescription>
                Select a skill you can offer in exchange for "{session.title}"
              </DialogDescription>
            </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Session Info */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm">{session.title}</h4>
              <p className="text-xs text-muted-foreground">
                with {session.hostId.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {session.date ? new Date(session.date).toLocaleDateString() : 'Date TBD'} at {session.startTime && session.endTime ? `${session.startTime} - ${session.endTime}` : 'TBD'}
              </p>
            </div>

            {/* Skill Selection */}
            <div className="grid gap-3">
              <Label htmlFor="skill-select">Select a skill you can offer in exchange *</Label>
              {isLoadingSkills ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading skills...</span>
                </div>
              ) : availableSkills.length === 0 ? (
                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                  You have no teaching skills. Add a teaching skill first.
                </div>
              ) : (
                <Combobox
                  options={availableSkills.map(skill => ({ 
                    value: skill._id, 
                    label: `${skill.name} (${skill.category})` 
                  }))}
                  value={selectedSkillId}
                  onValueChange={setSelectedSkillId}
                  placeholder="Select a skill to offer..."
                  searchPlaceholder="Search skills..."
                  emptyMessage="No skills found."
                  width="w-full"
                  className="[&_button]:focus:outline-none [&_button]:focus:ring-0 [&_[cmdk-item]]:focus:outline-none [&_[cmdk-item]]:focus:ring-0 [&_[cmdk-input]]:focus:outline-none [&_[cmdk-input]]:focus:ring-0 [&_button]:placeholder:text-sm [&_button]:text-sm [&_[cmdk-input]]:placeholder:text-sm [&_[cmdk-input]]:text-sm"
                />
              )}
            </div>

            {/* Message */}
            <div className="grid gap-3">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Introduce yourself and explain why you'd like to swap skills..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px] text-sm"
              />
            </div>

            {/* Meeting Link */}
            <div className="grid gap-3">
              <Label htmlFor="meeting-link">Meeting Link (optional)</Label>
              <Input
                id="meeting-link"
                placeholder="https://meet.google.com/xxx-xxxx-xxx or https://zoom.us/j/xxxxx"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Provide a meeting link for the exchange session (optional)
              </p>
            </div>
          </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                disabled={!selectedSkillId || isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Send Swap Request
              </Button>
            </DialogFooter>
          </form>
        ) : (
          // Confirmation Dialog
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Confirm Skill Swap Request
              </DialogTitle>
              <DialogDescription>
                Please review your request before sending
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              {/* Request Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Offering:</span>
                  <span className="text-sm text-foreground">
                    {selectedSkill?.name} ({selectedSkill?.category})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Requesting:</span>
                  <span className="text-sm text-foreground">{session.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Host:</span>
                  <span className="text-sm text-foreground">{session.hostId.name}</span>
                </div>
                {message && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-sm font-medium block mb-1">Message:</span>
                    <p className="text-sm text-muted-foreground">{message}</p>
                  </div>
                )}
                {meetingLink && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-sm font-medium block mb-1">Meeting Link:</span>
                    <p className="text-sm text-muted-foreground break-all">{meetingLink}</p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancelConfirmation}
                disabled={isSubmitting}
              >
                Back to Edit
              </Button>
              <Button 
                onClick={handleConfirmRequest}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm & Send
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SkillSwapRequestDialog;
