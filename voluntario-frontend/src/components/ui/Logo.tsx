import LogoSvg from '@/assets/Logo.svg';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const logoVariants = cva('aspect-square mx-auto object-scale-down', {
  variants: {
    size: {
      default: 'w-24',
      sm: 'w-16',
      lg: 'w-48  max-w-sm',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface LogoProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof logoVariants> {
  asChild?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, size, ...props }) => {
  return (
    <img
      src={LogoSvg}
      alt="Logo"
      className={cn(logoVariants({ size, className }))}
      {...props}
    />
  );
};

export const LogoLink: React.FC<LogoProps & { to: string }> = ({
  className,
  size,
  to,
}) => {
  const navigate = useNavigate();
  return (
    // <Link to={to}>
    <Logo
      onClick={() => navigate(to /* , { replace: true } */)}
      className={className}
      size={size}
    />
    // </Link>
  );
};
