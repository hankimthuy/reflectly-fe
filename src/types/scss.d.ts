/**
 * SCSS/CSS Module Type Declarations
 * 
 * Why do we need this file?
 * - TypeScript doesn't understand .scss/.css files by default
 * - Need to define types for CSS Modules
 * - Allows importing SCSS files without TypeScript errors
 * 
 * How it works:
 * - import './Component.scss' ✅ No TypeScript errors
 * - CSS Modules return object with className mapping
 * - Example: { 'header': 'header_abc123', 'content': 'content_def456' }
 * 
 * Benefits:
 * - Type safety for CSS imports
 * - IntelliSense support in IDE
 * - Smooth build process
 */

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
