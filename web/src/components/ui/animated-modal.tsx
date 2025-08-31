import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
}

interface ModalTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md", 
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

export const Modal: React.FC<ModalProps> = ({ children, isOpen = false, onClose, size = "2xl" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              duration: 0.4, 
              bounce: 0.1,
              ease: "easeOut"
            }}
            className={`relative z-50 w-full ${sizeClasses[size]} max-h-[95vh] flex flex-col`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalTrigger: React.FC<ModalTriggerProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => {
  return (
    <div className={`bg-card border border-border rounded-lg shadow-xl overflow-hidden flex flex-col h-full ${className || ''}`}>
      {children}
    </div>
  );
};

export const ModalContent: React.FC<ModalContentProps> = ({ children, className }) => {
  return (
    <div className={`px-16 py-8 flex-1 overflow-y-auto custom-scrollbar ${className || ''}`}>
      {children}
    </div>
  );
};

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return (
    <div className={`flex items-center justify-end gap-4 px-16 py-6 border-t border-border ${className || ''}`}>
      {children}
    </div>
  );
};

export const ModalHeader: React.FC<{ children: React.ReactNode; onClose?: () => void; className?: string }> = ({ children, onClose, className }) => {
  return (
    <div className={`flex items-center justify-between px-16 py-6 border-b border-border ${className || ''}`}>
      <h2 className="text-xl font-bold text-foreground">{children}</h2>
      {onClose && (
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
