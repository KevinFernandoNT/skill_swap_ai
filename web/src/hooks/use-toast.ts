import { toast as sonnerToast } from "sonner";

// Wrapper to maintain compatibility with existing code
export const useToast = () => {
  const toast = (options: {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
    action?: {
      label: string;
      onClick: () => void;
    };
  }) => {
    const { title, description, variant, action } = options;
    
    if (variant === "destructive") {
      return sonnerToast.error(title || "Error", {
        description,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
      });
    }
    
    return sonnerToast(title || "Success", {
      description,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    });
  };

  return { toast };
};

// Direct toast function for simpler usage
export const toast = (options: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: {
    label: string;
    onClick: () => void;
  };
}) => {
  const { title, description, variant, action } = options;
  
  if (variant === "destructive") {
    return sonnerToast.error(title || "Error", {
      description,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    });
  }
  
  return sonnerToast(title || "Success", {
    description,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
  });
};
