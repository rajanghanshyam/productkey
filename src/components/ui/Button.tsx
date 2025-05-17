import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50';
  
  const variantClasses = {
    primary: 'bg-blue-900 hover:bg-blue-800 text-white focus:ring-blue-500',
    secondary: 'bg-teal-700 hover:bg-teal-600 text-white focus:ring-teal-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-400',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-400',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-700 focus:ring-gray-400',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;