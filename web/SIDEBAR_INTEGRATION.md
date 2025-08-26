# Sidebar Integration Documentation

## Overview

The SkillSwap application now uses a modern, animated sidebar component that provides a better user experience with smooth transitions and responsive design.

## Components

### 1. Core Sidebar Component (`/src/components/ui/sidebar.tsx`)

This is the main sidebar component that provides:
- **Collapsible behavior**: Hover to expand, mouse leave to collapse
- **Mobile responsiveness**: Full-screen overlay on mobile devices
- **Smooth animations**: Using Framer Motion for fluid transitions
- **Context-based state management**: Shared state across sidebar components

#### Key Features:
- `Sidebar`: Main wrapper component
- `SidebarBody`: Container for sidebar content
- `SidebarLink`: Individual navigation links with icons
- `DesktopSidebar`: Desktop-specific sidebar implementation
- `MobileSidebar`: Mobile-specific sidebar implementation

### 2. Demo Sidebar (`/src/components/ui/sidebar-demo-2.tsx`)

A complete sidebar implementation that includes:
- **Navigation links**: Dashboard, Sessions, Skills, Connect, etc.
- **User profile section**: Shows user avatar and name
- **Logo component**: Branded logo with animations
- **Active state management**: Highlights current page

### 3. Layout Integration (`/src/components/layout/Sidebar.tsx`)

The layout wrapper that:
- Integrates with existing user management
- Handles navigation between pages
- Manages sidebar state
- Provides user context

## Usage

### Basic Implementation

```tsx
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

function MySidebar() {
  const [open, setOpen] = useState(false);
  
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody>
        <SidebarLink 
          link={{
            label: "Dashboard",
            href: "/dashboard",
            icon: <IconHome className="h-5 w-5" />
          }}
        />
      </SidebarBody>
    </Sidebar>
  );
}
```

### With Navigation

```tsx
import SidebarDemo from "@/components/ui/sidebar-demo-2";

function AppLayout() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  return (
    <div className="flex h-screen">
      <SidebarDemo 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={currentUser}
      />
      <main className="flex-1">
        {/* Main content */}
      </main>
    </div>
  );
}
```

## Styling

### Color Scheme

The sidebar uses a modern color palette:
- **Primary Blue**: `#3B82F6` - Main accent color
- **Green**: `#22C55E` - Success states
- **Orange**: `#F97316` - Warning states
- **Purple**: `#A855F7` - Info states
- **Red**: `#EF4444` - Error states

### Tailwind Classes

The sidebar is styled using Tailwind CSS with:
- Rounded corners (`rounded-lg`, `rounded-xl`)
- Subtle shadows (`shadow-md`, `shadow-lg`)
- Smooth transitions (`transition-all`, `duration-300`)
- Responsive breakpoints (`md:`, `lg:`)

## Features

### Desktop Behavior
- **Hover to expand**: Sidebar expands on mouse enter
- **Auto-collapse**: Sidebar collapses on mouse leave
- **Fixed width**: 300px when expanded, 60px when collapsed

### Mobile Behavior
- **Full-screen overlay**: Sidebar covers entire screen
- **Swipe to close**: Can be dismissed by swiping
- **Touch-friendly**: Larger touch targets for mobile

### Animations
- **Smooth transitions**: All state changes are animated
- **Framer Motion**: Uses motion/react for animations
- **Performance optimized**: Hardware-accelerated animations

## Customization

### Adding New Navigation Items

1. Update the `links` array in `sidebar-demo-2.tsx`
2. Add your icon from `@tabler/icons-react`
3. Update the navigation handler in your layout

### Styling Customization

1. Modify the Tailwind classes in the sidebar components
2. Update the color scheme in `tailwind.config.ts`
3. Add custom CSS variables for advanced styling

### Behavior Customization

1. Modify the `animate` prop to control animation behavior
2. Adjust the `open` state management for different behaviors
3. Customize the mobile breakpoints and behavior

## Dependencies

The sidebar requires these packages:
- `@tabler/icons-react` - For icons
- `motion` - For animations
- `tailwindcss` - For styling
- `clsx` - For conditional classes

## Browser Support

The sidebar supports:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Touch devices with proper gesture support

## Performance

- **Lazy loading**: Components are loaded only when needed
- **Optimized animations**: Uses CSS transforms for better performance
- **Minimal re-renders**: Efficient state management
- **Bundle size**: Lightweight implementation
