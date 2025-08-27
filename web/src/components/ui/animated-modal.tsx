import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
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

export const Modal: React.FC<ModalProps> = ({ children, isOpen = false, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-50 w-full max-w-2xl"
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
    <div className={`bg-card border border-border rounded-lg shadow-xl ${className || ''}`}>
      {children}
    </div>
  );
};

export const ModalContent: React.FC<ModalContentProps> = ({ children, className }) => {
  return (
    <div className={`p-6 ${className || ''}`}>
      {children}
    </div>
  );
};

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return (
    <div className={`flex items-center justify-end gap-4 p-6 border-t border-border ${className || ''}`}>
      {children}
    </div>
  );
};

export const ModalHeader: React.FC<{ children: React.ReactNode; onClose?: () => void }> = ({ children, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border">
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
