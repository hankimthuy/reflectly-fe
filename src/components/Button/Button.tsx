import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'rounded' | 'pill';

/**
 * The one shared button style for the whole app (Tailwind-only, using the coach-* palette
 * already established for the AI Coach era). Every clickable action — CTA, form submit,
 * icon-text button, nav-styled link — should render through this component instead of a
 * hand-rolled className string, so a button that forgets one Tailwind property can never
 * fall back to the legacy global `button` CSS reset and show up in the wrong color.
 */
// Every variant explicitly sets a `hover:bg-*` (even when it's the same as rest state, e.g.
// `hover:bg-transparent`) — never leave the hover background undeclared. Without it, nothing
// competes with the legacy global `button:hover { background: var(--c-secondary) }` reset in
// index.scss, which then silently paints the button brown on hover (the exact bug this
// component exists to eliminate — see index.scss's `@layer base` comment for the full story).
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-coach-primary text-white hover:bg-coach-primary-light disabled:hover:bg-coach-primary',
  secondary: 'border border-coach-border bg-coach-surface text-coach-text hover:bg-coach-bg disabled:hover:bg-coach-surface',
  ghost: 'bg-transparent text-coach-primary hover:bg-transparent hover:underline disabled:hover:bg-transparent disabled:hover:no-underline',
  danger: 'bg-transparent text-red-500 hover:bg-red-50 disabled:hover:bg-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1',
  md: 'px-4 py-2 text-sm gap-1.5',
  lg: 'px-7 py-3 text-base gap-2',
};

const SHAPE_CLASSES: Record<ButtonShape, string> = {
  rounded: 'rounded-lg',
  pill: 'rounded-full',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40';

function buttonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  shape: ButtonShape,
  className: string,
) {
  return [BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], SHAPE_CLASSES[shape], className]
    .filter(Boolean)
    .join(' ');
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
}

/** Renders a real `<button>`. Use for form submits and in-page actions. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', shape = 'rounded', className = '', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonClassName(variant, size, shape, className)}
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
  shape = 'rounded',
  className = '',
  ...props
}: ButtonLinkProps) => <Link className={buttonClassName(variant, size, shape, className)} {...props} />;

interface ButtonAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
}

/** Renders a plain `<a>` styled identically to `Button`. Use for external/placeholder links. */
export const ButtonAnchor = ({
  variant = 'primary',
  size = 'md',
  shape = 'rounded',
  className = '',
  ...props
}: ButtonAnchorProps) => <a className={buttonClassName(variant, size, shape, className)} {...props} />;

export default Button;
