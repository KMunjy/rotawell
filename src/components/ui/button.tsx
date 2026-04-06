import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) => {
  const variantClasses = {
    primary:
      'bg-primary text-white shadow-sm hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2',
    outline:
      'border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2',
    ghost:
      'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2',
    danger:
      'bg-accent text-white shadow-sm hover:bg-accent-500 active:bg-accent-600 focus-visible:ring-2 focus-visible:ring-accent-200 focus-visible:ring-offset-2',
  };

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold tracking-snug transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};
