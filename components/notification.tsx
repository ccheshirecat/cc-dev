'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Check, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface NotificationProps {
  message: string
  isVisible: boolean
  onClose: () => void
  type: 'success' | 'error'
  autoHideDuration?: number
  className?: string
}

export function Notification({ message, isVisible, onClose, type, autoHideDuration = 5000, className }: NotificationProps) {
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  useEffect(() => {
    if (isVisible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoHideDuration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={notificationRef}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.2 }}
          className={`fixed z-[100] top-4 right-4 ml-auto w-auto max-w-md ${className}`}
        >
          <div className={`
            flex items-center gap-3 rounded-xl p-4 backdrop-blur-sm
            ${type === 'error' ? 'bg-red-900/80 border border-red-500/20' : 'bg-green-900/80 border border-green-500/20'}
          `}>
            <div className={`
              p-2 rounded-lg
              ${type === 'error' ? 'bg-red-500/20' : 'bg-green-500/20'}
            `}>
              {type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-300" />
              ) : (
                <Check className="w-5 h-5 text-green-300" />
              )}
            </div>
            <span className="text-sm text-white flex-grow">{message}</span>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

