import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-900">{label}</label>
      )}
      <input
        className={cn(
          'rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}
    </div>
  );
};
