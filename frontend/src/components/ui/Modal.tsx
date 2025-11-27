import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-overlay"
      onClick={onClose} // Close when clicking on backdrop
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-dark-secondary rounded-xl p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()} // Don't close when clicking inside modal
        tabIndex={-1} // Allow focus
      >
        {title && (
          <h2 className="text-xl font-bold text-text-primary mb-4">
            {title}
          </h2>
        )}
        {showCloseButton && (
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-white"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        )}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};