'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Check, X } from 'lucide-react'
import { useEffect } from 'react'

interface NotificationProps {
  message: string
  isVisible: boolean
  onClose: () => void
  type: 'success' | 'error'
  autoHideDuration?: number
}

export function Notification({ message, isVisible, onClose, type, autoHideDuration = 5000 }: NotificationProps) {
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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed z-[100] bottom-4 left-4 right-4 mx-auto w-auto max-w-md"
        >
          <div className={`
            flex items-center gap-3 rounded-xl p-4
            ${type === 'error' ? 'bg-[#1a1b23] border border-red-500/20' : 'bg-gray-900 border border-green-500/20'}
          `}>
            <div className={`
              p-2 rounded-lg
              ${type === 'error' ? 'bg-red-500/20' : 'bg-green-500/20'}
            `}>
              {type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>
            <span className="text-sm text-white flex-grow">{message}</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

