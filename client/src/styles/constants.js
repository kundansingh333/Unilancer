// src/styles/constants.js
/**
 * Design System Constants
 * All styling follows the strict Tailwind v4 design system
 */

// Color tokens
export const COLORS = {
  accent: "#5B6AEA",
  dark: "#1E1F35",
  light: "#F5F5F5",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
};

// Spacing scale
export const SPACING = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
  "2xl": "4rem",
};

// Typography scale
export const FONT_SIZES = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "6xl": "3.75rem",
};

// Border radius
export const BORDER_RADIUS = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  full: "9999px",
};

// Shadow scales
export const SHADOWS = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
};

// Breakpoints
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Responsive container
export const CONTAINER = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

// Grid patterns
export const GRID_PATTERNS = {
  cols1: "grid-cols-1",
  cols2: "md:grid-cols-2",
  cols3: "lg:grid-cols-3",
  cols4: "lg:grid-cols-4",
  gap4: "gap-4",
  gap6: "gap-6",
  gap8: "gap-8",
};
