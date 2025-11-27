import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface OrnamentProps {
  ornament: {
    id: number;
    text: string;
    x: number;
    y: number;
    color: string;
  };
  onUpdate: (id: number, text: string) => void;
}

export function Ornament({ ornament, onUpdate }: OrnamentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(ornament.text);

  const handleSubmit = () => {
    onUpdate(ornament.id, inputValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setInputValue(ornament.text);
      setIsEditing(false);
    }
  };

  return (
    <>
      <motion.div
        className="absolute cursor-pointer group"
        style={{
          left: `${ornament.x}%`,
          top: `${ornament.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        onClick={() => setIsEditing(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: ornament.id * 0.01,
          type: 'spring',
          stiffness: 200,
          damping: 10
        }}
        whileHover={{ scale: 1.2 }}
      >
        {/* Ornament ball */}
        <div
          className="w-6 h-6 rounded-full relative transition-all"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${ornament.color}dd, ${ornament.color})`,
            boxShadow: `0 2px 8px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.3)`,
          }}
        >
          {/* Highlight */}
          <div 
            className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white opacity-60"
            style={{ filter: 'blur(1px)' }}
          />
          {/* Text indicator */}
          {ornament.text && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#fef3c7] rounded-full border-2 border-[#f59e0b] flex items-center justify-center">
              <span className="text-[8px]">✓</span>
            </div>
          )}
        </div>
        
        {/* Hover tooltip */}
        {ornament.text && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-[#1e293b] text-[#e0e7ff] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap max-w-[200px] truncate z-10">
            {ornament.text}
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-[#1e293b] to-[#334155] p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 border-[#f59e0b]"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-[#fef3c7] mb-4 text-center">
                Add Your Message
              </h3>
              <textarea
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-4 bg-[#0f172a] text-[#e0e7ff] rounded-lg border-2 border-[#475569] focus:border-[#f59e0b] focus:outline-none resize-none"
                rows={4}
                placeholder="Enter your message..."
                maxLength={200}
              />
              <div className="text-right text-[#94a3b8] text-sm mt-2 mb-4">
                {inputValue.length}/200
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setInputValue(ornament.text);
                    setIsEditing(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#475569] text-[#e0e7ff] rounded-lg hover:bg-[#64748b] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white rounded-lg hover:from-[#b91c1c] hover:to-[#991b1b] transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
