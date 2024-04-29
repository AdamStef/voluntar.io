import { cn } from '@/lib/utils';
import React, { HtmlHTMLAttributes } from 'react';

export const H1 = React.forwardRef<
  HTMLHeadingElement,
  HtmlHTMLAttributes<HTMLHeadingElement>
>(({ className, children }, ref) => {
  return (
    <h1
      ref={ref}
      className={cn(
        'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
        className,
      )}
    >
      {children}
    </h1>
  );
});

export const H2 = React.forwardRef<
  HTMLHeadingElement,
  HtmlHTMLAttributes<HTMLHeadingElement>
>(({ className, children }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn(
        'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className,
      )}
    >
      {children}
    </h2>
  );
});

export const H3 = React.forwardRef<
  HTMLHeadingElement,
  HtmlHTMLAttributes<HTMLHeadingElement>
>(({ className, children }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h3>
  );
});

export const H4 = React.forwardRef<
  HTMLHeadingElement,
  HtmlHTMLAttributes<HTMLHeadingElement>
>(({ className, children }, ref) => {
  return (
    <h4
      ref={ref}
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h4>
  );
});
