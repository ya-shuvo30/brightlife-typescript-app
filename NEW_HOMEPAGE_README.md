# New Homepage Components

This document describes the new homepage components created for BrightLife Bangladesh Ltd.

## Components Created

### 1. NewNavbar.tsx
- **Location**: `src/components/layout/NewNavbar.tsx`
- **Features**: 
  - Responsive sticky navigation
  - Logo and company name display
  - Dropdown for Services menu
  - Mobile hamburger menu
  - Smooth scroll navigation
- **Usage**: Automatically included in HomePage

### 2. SimpleCarousel.tsx
- **Location**: `src/components/carousel/SimpleCarousel.tsx`
- **Features**:
  - CSS-based slide transitions (fade effect)
  - Auto-play with pause on hover
  - Navigation arrows and pagination dots
  - Keyboard navigation (arrow keys, spacebar)
  - Play/pause button
  - Responsive design
- **Props**:
  - `slides`: Array of carousel slide objects
  - `autoplay`: Boolean (default: true)
  - `autoplayDelay`: Number in milliseconds (default: 6000)

### 3. WhoWeAre.tsx
- **Location**: `src/components/sections/WhoWeAre.tsx`
- **Features**:
  - Customizable title and description
  - Feature cards with icons
  - Call-to-action button
  - Responsive grid layout
- **Props**:
  - `title`: String (default: "Who We Are")
  - `description`: String (default company description)
  - `features`: Array of feature objects with icon, title, description

### 4. HomePage.tsx
- **Location**: `src/pages/HomePage.tsx`
- **Features**:
  - Complete homepage layout
  - All sections integrated
  - Smooth scroll navigation
  - Professional design
  - Responsive layout

## Data Configuration

### Carousel Data
- **Location**: `src/data/newCarouselData.ts`
- **Content**: Three slides with images, titles, subtitles, descriptions, and call-to-action buttons
- **Images Used**: 
  - Slide-01.png
  - Slide-02 (1).png
  - coverpage.jpg

## Styling

### CSS Animations
- **Location**: `src/index.css`
- **Animations Added**:
  - `fadeInUp` keyframe animation
  - `.animate-fade-in-up` class with delays
  - Responsive and smooth transitions

### Design System
- **Colors**: 
  - Primary: Green (#059669, #047857)
  - Accent: Yellow/Orange (#f59e0b, #fcd34d)
  - Background: White and Gray shades
- **Typography**: Inter for headings, Source Sans Pro for body text
- **Responsive**: Mobile-first design with Tailwind CSS

## Usage Instructions

1. **To use the complete homepage**:
   ```tsx
   import HomePage from './pages/HomePage';
   
   function App() {
     return <HomePage />;
   }
   ```

2. **To customize carousel slides**:
   Edit `src/data/newCarouselData.ts` with your own images and content.

3. **To modify the navigation menu**:
   Edit the menu items in `src/components/layout/NewNavbar.tsx`.

4. **To update company information**:
   Edit the content in `src/components/sections/WhoWeAre.tsx`.

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile, tablet, and desktop
- Accessibility features included (ARIA labels, keyboard navigation)

## Development Server

Run the development server:
```bash
npm run dev
```

The homepage will be available at `http://localhost:5175/` (or the next available port).

## Key Features

✅ Responsive design
✅ Professional appearance
✅ Smooth animations
✅ Accessibility compliant
✅ TypeScript support
✅ Performance optimized
✅ Easy to customize
✅ Modern React patterns