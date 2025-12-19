// DESIGN SYSTEM IMPLEMENTATION GUIDE

/**
 * Unilancer Design System - Tailwind v4 Strict Inline Utilities
 * 
 * This guide ensures consistent UI across the entire frontend application.
 * ALL styling must follow this system. No custom CSS files are permitted.
 */

// ============================================================================
// 1. THEME TOKENS (tailwind.config.js)
// ============================================================================

/*
Colors:
- accent: #5B6AEA (CTAs, active states, focus rings)
- dark: #1E1F35 (headings, navbar, footer)
- light: #F5F5F5 (backgrounds, light surfaces)
- success: #10B981
- warning: #F59E0B
- danger: #EF4444
- info: #3B82F6

Typography:
- font-display: Poppins (headings only)
- font-sans: Inter (everything else)

Sizes: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl, text-6xl
Weights: 400 (body), 500 (UI text), 600 (cards/labels), 700 (headers)
*/

// ============================================================================
// 2. COMPONENT LIBRARY
// ============================================================================

/*
Available components (in src/components/):

1. Button.jsx
   Variants: primary, secondary, outline, light, danger, ghost
   Sizes: sm, md, lg, xl
   Usage: import Button from '@/components/Button'

2. Card.jsx
   Props: hoverable, padding, className
   Usage: import Card from '@/components/Card'

3. Input.jsx
   Props: type, placeholder, label, value, onChange, error, disabled
   Usage: import Input from '@/components/Input'

4. Badge.jsx
   Variants: primary, secondary, success, warning, danger, info
   Usage: import Badge from '@/components/Badge'

5. Alert.jsx
   Variants: success, warning, danger, info
   Props: title, onClose, icon (optional)
   Usage: import Alert from '@/components/Alert'

6. Modal.jsx
   Props: isOpen, onClose, title, size (sm/md/lg/xl)
   Usage: import Modal from '@/components/Modal'

7. FormContainer.jsx
   Props: title, subtitle, onSubmit, logo
   Usage: import FormContainer from '@/components/FormContainer'

8. DashboardCard.jsx
   Props: icon, title, value, subtitle, variant
   Usage: import DashboardCard from '@/components/DashboardCard'

9. Pagination.jsx
   Props: currentPage, totalPages, onPageChange
   Usage: import Pagination from '@/components/Pagination'

10. Tabs.jsx
    Props: tabs (array), activeTab, onTabChange
    Usage: import Tabs from '@/components/Tabs'
*/

// ============================================================================
// 3. LAYOUT PATTERNS (MUST USE THESE)
// ============================================================================

/*
Container (max-width)
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

Page background
<div className="bg-light min-h-screen">

Grid layouts
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

Flex spacing
flex flex-col sm:flex-row gap-4

Navigation bar
bg-gradient-hero sticky top-0 z-40 shadow-lg

Footer
bg-dark text-light py-12

Section header
text-4xl font-display font-bold text-dark
*/

// ============================================================================
// 4. SPACING RULES (STRICT SCALE)
// ============================================================================

/*
ALWAYS USE: p-4, p-6, gap-2, gap-4, gap-6, gap-8, gap-12
NEVER USE: p-5, p-7, gap-3, gap-5, gap-7, mt-[13px], etc.

Padding: p-4, p-6
Margins: my-8, my-12, mt-6
Gaps: gap-2, gap-4, gap-6, gap-8, gap-12
*/

// ============================================================================
// 5. FORM PATTERNS
// ============================================================================

/*
Use the Input component instead of <input>:

import Input from '@/components/Input';

<Input
  type="email"
  label="Email"
  placeholder="user@college.edu"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={error} // optional
  required
/>

Use the Button component for all buttons:

import Button from '@/components/Button';

<Button variant="primary" size="md">
  Submit
</Button>
*/

// ============================================================================
// 6. COLOR USAGE RULES
// ============================================================================

/*
Headings:
<h1 className="text-4xl font-display font-bold text-dark">Title</h1>

Links/CTAs:
<a href="#" className="text-accent hover:text-blue-600 transition-colors">Link</a>

Body text:
<p className="text-base text-dark">Text</p>

Secondary text:
<p className="text-sm text-gray-600">Subtitle</p>

Borders:
border border-gray-100 (light)
border-2 border-accent (accent)

Hover effects:
hover:bg-light
hover:shadow-md
hover:-translate-y-0.5
transition-all duration-200
*/

// ============================================================================
// 7. RESPONSIVE DESIGN
// ============================================================================

/*
Mobile first approach:

<div className="px-4 sm:px-6 lg:px-8">
  <h1 className="text-2xl sm:text-3xl lg:text-4xl">
    Responsive heading
  </h1>
</div>

Grid breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

Hidden/visible:
hidden md:block (visible on md+)
block md:hidden (hidden on md+)
*/

// ============================================================================
// 8. ANIMATIONS (LIMITED SET)
// ============================================================================

/*
Allowed animations:
- animate-fade-in
- animate-slide-in
- animate-spin

Hover transitions:
- transition-all duration-200
- hover:shadow-lg
- hover:-translate-y-0.5
- hover:scale-105

Focus states (handled by Input component):
- focus:border-accent
- focus:ring-2 focus:ring-accent/30
*/

// ============================================================================
// 9. ICONS AND IMAGES
// ============================================================================

/*
Import logo:
import logo from '../../assets/logo.webp';
<img src={logo} alt="Unilancer" className="h-10 w-10 rounded-lg" />

Avatars (circular):
<div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
  U
</div>

Images responsive:
<img src={src} alt="alt" className="w-full h-auto rounded-lg" />
*/

// ============================================================================
// 10. COMMON PATTERNS
// ============================================================================

/*
Hero section (gradient background):
<section className="bg-gradient-hero text-white py-20">

Card list:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id} hoverable>
      Content
    </Card>
  ))}
</div>

Status badge:
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Rejected</Badge>

Error message:
<Alert variant="danger" title="Error">
  {error message}
</Alert>

Success message:
<Alert variant="success" title="Success">
  {success message}
</Alert>
*/

// ============================================================================
// 11. DARK MODE (NOT SUPPORTED)
// ============================================================================

/*
This design system does NOT support dark mode.
All components use light backgrounds with dark text.
*/

// ============================================================================
// 12. DO's AND DON'Ts
// ============================================================================

/*
DO:
✅ Use Tailwind utility classes only
✅ Import and use Button, Card, Input, Badge, Alert components
✅ Follow the spacing scale (p-4, p-6, gap-4, gap-6)
✅ Use the design tokens (bg-accent, text-dark, text-light)
✅ Keep the responsive structure (sm:, md:, lg:)
✅ Use the CONTAINER constant for max-width layouts
✅ Import logo from assets/logo.webp

DON'T:
❌ Write custom CSS files
❌ Use style={{}} inline styles
❌ Use arbitrary colors (#hex, rgb())
❌ Use arbitrary sizes (mt-[13px], p-[22px])
❌ Create custom button styles
❌ Use dark mode classes
❌ Mix component styling approaches
❌ Add animations outside the defined set

VIOLATIONS = INCONSISTENT UI = AUTOMATIC REJECTION
*/

export default {};
