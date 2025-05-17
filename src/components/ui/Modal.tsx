import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10 transform transition-all">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Body */}
          <div className="p-6">{children}</div>
          
          {/* Footer */}
          {footer && <div className="px-6 py-4 border-t border-gray-200">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default Modal;