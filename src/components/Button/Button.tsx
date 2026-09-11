import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'rounded' | 'pill';

/**
 * The one shared button style for the whole app, built on the design system's `.btn` classes
 * (see src/styles/tailwind.css) instead of a hand-rolled className string — every clickable
 * action (CTA, form submit, icon-text button, nav-styled link) should render through this
 * component so it can never drift from the system.
 *
 * `shape` is kept for API compatibility with existing call sites but has no visual effect:
 * Aura Soft renders every button as a pill, so both shapes come out the same.
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  // Clay, not accent: Aura Soft reserves indigo/accent for "primary action" and clay for
  // "needs attention", and a destructive action is the latter.
  danger: 'btn-secondary !border-clay !text-clay',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'text-xs py-1.5 px-3 gap-1',
  md: 'text-sm py-2.5 px-4 gap-1.5',
  lg: 'text-base py-4 px-6 gap-2',
};

function buttonClassName(variant: ButtonVariant, size: ButtonSize, className: string) {
  return ['btn', VARIANT_CLASSES[variant], SIZE_CLASSES[size], className].filter(Boolean).join(' ');
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
}

/** Renders a real `<button>`. Use for form submits and in-page actions. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonClassName(variant, size, className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
}

/** Renders a react-router `<Link>` styled identically to `Button`. Use for navigation CTAs. */
export const ButtonLink = ({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonLinkProps) => <Link className={buttonClassName(variant, size, className)} {...props} />;

interface ButtonAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
}

/** Renders a plain `<a>` styled identically to `Button`. Use for external/placeholder links. */
export const ButtonAnchor = ({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonAnchorProps) => <a className={buttonClassName(variant, size, className)} {...props} />;

export default Button;
