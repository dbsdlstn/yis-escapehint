import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  const cardClasses = `bg-dark-secondary rounded-xl p-6 shadow-lg ${
    onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''
  } ${className}`;

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? 'Card' : undefined}
    >
      {children}
    </div>
  );
};