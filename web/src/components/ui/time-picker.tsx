import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value = '',
  onChange,
  label,
  placeholder = 'Select time',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':');
      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTimeSelect = (hour: string, minute: string) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    const timeString = `${hour}:${minute}`;
    onChange?.(timeString);
    setIsOpen(false);
  };

  const displayValue = value || placeholder;

  // Generate time options
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      
      <div
        ref={dropdownRef}
        className={`relative w-full h-12 px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus-within:outline-none focus-within:ring-0 focus-within:border-border cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-border/80'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
              {displayValue}
            </span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-64 overflow-hidden"
            >
              <div className="p-2">
                <div className="grid grid-cols-2 gap-2">
                  {/* Hours */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1">Hour</div>
                    <div className="max-h-32 overflow-y-auto custom-scrollbar">
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className={`px-2 py-1 text-sm rounded cursor-pointer hover:bg-muted transition-colors ${
                            selectedHour === hour ? 'bg-primary text-primary-foreground' : 'text-foreground'
                          }`}
                          onClick={() => handleTimeSelect(hour, selectedMinute || '00')}
                        >
                          {hour}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Minutes */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1">Minute</div>
                    <div className="max-h-32 overflow-y-auto custom-scrollbar">
                      {minutes.map((minute) => (
                        <div
                          key={minute}
                          className={`px-2 py-1 text-sm rounded cursor-pointer hover:bg-muted transition-colors ${
                            selectedMinute === minute ? 'bg-primary text-primary-foreground' : 'text-foreground'
                          }`}
                          onClick={() => handleTimeSelect(selectedHour || '00', minute)}
                        >
                          {minute}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
