import { LoaderCircle } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'patient';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-ocu-indigo text-white shadow-tactile hover:bg-[#414B94] active:translate-y-1 active:shadow-none',
  secondary:
    'border-2 border-[#D5D2CB] bg-white text-ocu-indigo shadow-tactile-neutral hover:border-ocu-blue active:translate-y-1 active:shadow-none',
  danger: 'bg-ocu-red text-white shadow-tactile-danger hover:bg-[#AD1100] active:translate-y-1 active:shadow-none',
  warning:
    'bg-ocu-orange text-ocu-ink shadow-[0_4px_0_#D98717] hover:bg-[#F3A126] active:translate-y-1 active:shadow-none',
  success:
    'bg-ocu-green text-ocu-ink shadow-[0_4px_0_#4F875A] hover:bg-[#62A06C] active:translate-y-1 active:shadow-none',
  ghost: 'bg-transparent text-ocu-indigo hover:bg-ocu-indigo/8 active:bg-ocu-indigo/12'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-10 rounded-xl px-4 text-sm',
  md: 'h-12 rounded-2xl px-5 text-[15px]',
  lg: 'h-14 rounded-2xl px-6 text-base',
  patient: 'min-h-[68px] rounded-[20px] px-7 text-lg'
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth,
    disabled,
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 font-black tracking-tight transition-colors disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-45 disabled:shadow-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle className="animate-spin" size={19} aria-hidden="true" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  leftIcon,
  rightIcon,
  fullWidth,
  ...props
}: LinkProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <Link
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 font-black tracking-tight transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  );
}
