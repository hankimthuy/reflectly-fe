# Responsive Design System - Reflectly

This document outlines the comprehensive responsive design system implemented for the Reflectly application, optimized for mobile devices, tablets, and desktop monitors.

## 📱 Supported Devices

### Mobile Devices
- **Smartphones (portrait)**: Up to 500px
- **General Mobile**: 320px - 499px

### Desktop Screens  
- **Laptop**: 992px (Laptops)
- **Desktop**: 1400px+ (Desktop monitors)

## 🎯 Breakpoints

```scss
$breakpoints: (
  mobile: 500px,       // Smartphones (portrait)
  laptop: 992px,       // Laptop
  desktop: 1400px      // Desktop, Monitor
);
```

## 🛠️ Key Features

### 1. Mobile-First Approach
- All styles start with mobile specifications
- Progressive enhancement for larger screens
- Optimized touch targets (minimum 44px)

### 2. Viewport Height (vh) Usage
- Consistent full-screen experience across devices
- Proper handling of mobile browser UI changes
- Responsive container heights

### 3. Flexible Layout System
- **Mobile**: Single column, full-width layout
- **Small Desktop**: Constrained width with centered container
- **Large Desktop**: Multi-column layouts with enhanced spacing

## 📐 Layout Specifications

### Container Widths
```scss
// Mobile: 100vw (full width)
// Small Desktop: 1024px (constrained)
// Large Desktop: 1200px
```

### Navigation Behavior
- **Mobile**: Fixed bottom navigation with backdrop blur
- **Small Desktop**: Rounded floating navigation
- **Large Desktop**: Fixed bottom navigation with enhanced styling

## 🎨 Design Tokens

### Spacing Scale (Responsive)
```scss
// Mobile → Small Desktop → Large Desktop
--spacing-xs: 4px → 4px → 4px
--spacing-sm: 8px → 8px → 8px  
--spacing-md: 16px → 20px → 16px
--spacing-lg: 24px → 28px → 20px
--spacing-xl: 32px → 40px → 28px
```

### Typography Scale (Responsive)
```scss
// Mobile → Small Desktop → Large Desktop
--font-size-sm: 14px → 15px → 16px
--font-size-base: 16px → 17px → 18px
--font-size-lg: 18px → 19px → 20px
--font-size-xl: 20px → 22px → 24px
```

## 🔧 Mixins & Utilities

### Responsive Mixins
```scss
@include mobile-only { /* Mobile styles */ }
@include respond-to(laptop) { /* Small Desktop+ styles */ }
@include respond-to(desktop) { /* Large Desktop+ styles */ }
```

### Layout Mixins
```scss
@include flex-center;           // Flexbox center alignment
@include flex-between;          // Space between alignment
@include grid-responsive(1, 2, 3); // Responsive grid
```

### Spacing Mixins
```scss
@include padding-responsive($mobile, $laptop, $desktop);
@include margin-responsive($mobile, $laptop, $desktop);
@include font-responsive($mobile, $laptop, $desktop);
```

## 📱 Component Adaptations

### Header Component
- **Mobile**: Sticky header with backdrop blur
- **Small Desktop**: Enhanced spacing and hover effects
- **Large Desktop**: Larger avatar and improved typography

### Navigation Bar
- **Mobile**: Fixed bottom with glass morphism
- **Small Desktop**: Floating rounded design
- **Large Desktop**: Fixed bottom with enhanced styling

### Cards & Content
- **Mobile**: Full-width with minimal margins
- **Small Desktop**: Constrained width with hover animations
- **Large Desktop**: Multi-column layouts with enhanced shadows

## 🎯 Performance Optimizations

### CSS Custom Properties
- Responsive values defined at root level
- Automatic scaling based on screen size
- Consistent design tokens across components

### Efficient Media Queries
- Mobile-first approach reduces CSS overhead
- Consolidated breakpoints for better maintainability
- Optimized for modern browsers

## 🚀 Usage Examples

### Basic Responsive Component
```scss
.my-component {
  @include padding-responsive(
    var(--spacing-md),     // Mobile
    var(--spacing-lg),     // Tablet
    var(--spacing-xl)      // Laptop
  );
  
  @include font-responsive(
    var(--font-size-sm),   // Mobile
    var(--font-size-base), // Tablet  
    var(--font-size-lg)    // Laptop
  );
  
  // Mobile-specific styles
  @include mobile-only {
    border-radius: var(--border-radius-sm);
  }
  
  // Tablet and up
  @include respond-to(tablet) {
    border-radius: var(--border-radius-lg);
    &:hover {
      transform: translateY(-2px);
    }
  }
  
  // Laptop and up
  @include respond-to(laptop-sm) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

### Responsive Grid Layout
```scss
.content-grid {
  @include grid-responsive(1, 2, 3); // 1 col mobile, 2 tablet, 3 laptop
  gap: var(--spacing-md);
  
  @include respond-to(tablet) {
    gap: var(--spacing-lg);
  }
}
```

## 🔍 Testing Guidelines

### Device Testing
1. **iPhone 14 Pro** (393×852): Test touch interactions and navigation
2. **Samsung Galaxy**: Verify Android-specific behaviors  
3. **14" Laptop** (1366px): Check layout transitions
4. **15.6" Laptop** (1920px): Verify enhanced layouts

### Browser Testing
- Chrome DevTools responsive mode
- Safari iOS simulator
- Firefox responsive design mode
- Edge mobile emulation

## 📊 Accessibility Features

### Touch Targets
- Minimum 44px touch targets on mobile
- Enhanced button sizes for better usability
- Proper spacing between interactive elements

### Typography
- Scalable font sizes across devices
- Proper line heights for readability
- High contrast ratios maintained

### Navigation
- Keyboard navigation support
- Focus indicators on all interactive elements
- Screen reader friendly markup

## 🎨 Visual

### Animations & Transitions
- Subtle hover effects on tablet/laptop
- Smooth transitions between breakpoints
- Performance-optimized animations

### Shadows & Depth
- Responsive shadow system
- Enhanced depth on larger screens
- Consistent visual hierarchy

## 🔧 Maintenance

### Adding New Breakpoints
1. Update `$breakpoints` map in `_responsive.scss`
2. Add corresponding mixins if needed
3. Update CSS custom properties in `_variables.scss`
4. Test across all target devices

### Updating Spacing Scale
1. Modify CSS custom properties in `_variables.scss`
2. Update responsive media queries
3. Test component layouts
4. Verify accessibility compliance

This responsive system ensures your Reflectly app provides an optimal experience across all target devices while maintaining consistent design principles and performance standards.

## 🖱️ Button Hover Convention

Any component button whose rest state sets `background: none` / `transparent` must restate that explicitly inside its own `:hover` block via `@include ghost-button-hover(...)` from `_responsive.scss`, to prevent inheriting the global filled-button hover background (`src/index.scss` bare `button:hover` rule sets a dark `--c-secondary` background that otherwise leaks through by CSS specificity).
