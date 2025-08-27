import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface AnimatedListProps {
  items: string[];
  onItemSelect?: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  displayScrollbar?: boolean;
  className?: string;
  maxHeight?: string;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = true,
  className = '',
  maxHeight = '200px'
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableArrowNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedIndex === null) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => prev !== null ? Math.max(0, prev - 1) : 0);
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => prev !== null ? Math.min(items.length - 1, prev + 1) : 0);
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex !== null && onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, items, onItemSelect, enableArrowNavigation]);

  const handleItemClick = (item: string, index: number) => {
    setSelectedIndex(index);
    if (onItemSelect) {
      onItemSelect(item, index);
    }
  };

  const scrollToItem = (index: number) => {
    if (listRef.current) {
      const itemElement = listRef.current.children[index] as HTMLElement;
      if (itemElement) {
        itemElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  useEffect(() => {
    if (selectedIndex !== null) {
      scrollToItem(selectedIndex);
    }
  }, [selectedIndex]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={listRef}
        className={`overflow-y-auto ${displayScrollbar ? 'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent' : 'scrollbar-hide'}`}
        style={{ maxHeight }}
      >
        <div className="space-y-1">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`relative cursor-pointer rounded-md px-3 py-2 text-sm transition-all duration-200 ${
                  selectedIndex === index
                    ? 'bg-primary text-primary-foreground'
                    : hoveredIndex === index
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                onClick={() => handleItemClick(item, index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{item}</span>
                  {selectedIndex === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-primary-foreground rounded-full"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {showGradients && (
        <>
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-card to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        </>
      )}

      {enableArrowNavigation && items.length > 0 && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedIndex(prev => prev !== null ? Math.max(0, prev - 1) : 0)}
            className="p-1 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
            disabled={selectedIndex === 0}
          >
            <ChevronUp className="w-3 h-3" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedIndex(prev => prev !== null ? Math.min(items.length - 1, prev + 1) : 0)}
            className="p-1 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
            disabled={selectedIndex === items.length - 1}
          >
            <ChevronDown className="w-3 h-3" />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default AnimatedList;
