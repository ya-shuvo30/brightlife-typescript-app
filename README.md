# BrightLife Health Membership Platform

A modern React TypeScript application for health membership management, built with performance and user experience in mind.

## Features

- **Multi-step Membership Form** - Comprehensive application process with validation
- **Real-time Validation** - Form validation with immediate feedback
- **PDF Generation** - Client-side PDF generation for membership receipts
- **Django REST API Integration** - Backend integration with field mapping
- **Performance Optimized** - Virtual scrolling, lazy loading, and memoization
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript implementation

### Membership Form Updates (Latest)

**Form Structure Optimization:**

- Reduced from 5 steps to 3 steps for faster completion
- Combined related sections for better user flow

#### Step 1: Personal Information

- ✨ **Proposal Information Section** (NEW) - Auto-generate feature with unique proposal numbers
  - Proposal No with auto-generate button (format: BLBD-{timestamp}-{random})
  - FO Code input field
  - FO Name input field
  - Removed Membership No field
- 📧 **Email Field Added** - New email input in personal information
- Membership type selection (Silver, Bronze, Gold, Executive)
- Personal details (name in English/Bangla, family names)
- Contact information, DOB, nationality, marital status
- Education, occupation, income details

#### Step 2: Address & Nominee (COMBINED)

- Present and permanent address with copy feature
- 3 nominees management in table format
- Real-time share percentage validation (must equal 100%)
- Nominee ID proof upload (multiple files supported)
- Visual divider between sections

#### Step 3: Physical & Review (COMBINED)

- Physical measurements (weight, height, blood group, chest)
- Medical history and surgery details
- Medical records upload (optional)
- Complete application review with all sections
- Download form as PDF feature
- Terms & conditions acceptance with declaration
- Visual divider between measurement and review sections

**UI/UX Improvements:**

- Auto-generate button with enhanced styling (shadows, transitions, hover effects)
- Button perfectly aligned with input fields
- Professional gray background for proposal information section
- Responsive grid layouts (1/2/3/4 columns based on screen size)
- Visual dividers between combined sections
- Color-coded validation messages (green for valid, yellow for warnings)

**Technical Enhancements:**

- TypeScript type safety with FormStepProps
- Field mapping for Django backend compatibility
- Mock API mode for frontend-only development
- Error handling with detailed validation messages
- File upload with size limits and type validation

## Tech Stack

- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.2
- Zustand - State management
- Tailwind CSS - Styling
- Axios - HTTP client
- jsPDF - PDF generation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Django backend running on port 8000 (optional - mock mode available)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env.local` file:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false  # Set to true for mock mode
```

## Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Production build with type checking
- `npm run lint` - ESLint code quality check
- `npm run preview` - Preview production build locally

## Project Structure

```txt
src/
├── assets/
│   ├── css/
│   │   └── animations.css
│   └── images/
│       ├── coverpage.jpg
│       ├── logo.png
│       ├── protective-life-logo.png
│       └── Slide-*.png (6 slides)
├── components/
│   ├── carousel/
│   │   ├── Carousel.tsx
│   │   ├── CarouselSlide.tsx
│   │   ├── NewCarousel.tsx
│   │   └── SimpleCarousel.tsx
│   ├── compound/
│   │   └── Card.tsx
│   ├── demo/
│   │   ├── ComponentArchitectureShowcase.tsx
│   │   ├── FormExample.tsx
│   │   ├── ModernFeaturesShowcase.tsx
│   │   └── UIShowcase.tsx
│   ├── enhanced/
│   │   ├── EnhancedHome.tsx
│   │   └── ModernApp.tsx
│   ├── examples/
│   │   ├── PerformanceShowcase.tsx
│   │   └── TypeScriptExample.tsx
│   ├── forms/
│   │   ├── membership/
│   │   │   ├── AddressNomineeStep.tsx      # Combined Address & Nominee (Step 2)
│   │   │   ├── AddressStep.tsx             # Legacy (not used)
│   │   │   ├── MembershipAdmin.tsx
│   │   │   ├── MembershipFormSteps.tsx     # Main form controller (3 steps)
│   │   │   ├── MembershipFormValidation.ts
│   │   │   ├── NomineeStep.tsx             # Legacy (not used)
│   │   │   ├── PersonalInfoStep.tsx        # Step 1: Personal Info
│   │   │   ├── PhysicalMeasurementStep.tsx # Part of Step 3
│   │   │   └── ReviewStep.tsx              # Part of Step 3
│   │   ├── shared/
│   │   │   ├── FileUpload.tsx
│   │   │   ├── FormProgress.tsx
│   │   │   └── SuccessModal.tsx
│   │   ├── FormContext.tsx
│   │   ├── FormProvider.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── NewNavbar.tsx
│   │   └── TopBar.tsx
│   ├── sections/
│   │   ├── AboutUs.tsx
│   │   ├── CallbackCTA.tsx
│   │   ├── Contact.tsx
│   │   ├── CustomerSupport.tsx
│   │   ├── HeroCarousel.tsx
│   │   ├── Home.tsx
│   │   ├── InsurancePartner.tsx
│   │   ├── NetworkHospital.tsx
│   │   ├── OurServices.tsx
│   │   ├── Registration.tsx
│   │   ├── SuperShop.tsx
│   │   ├── Transportation.tsx
│   │   ├── ValuedMembers.tsx
│   │   └── WhoWeAre.tsx
│   ├── shared/
│   │   ├── ErrorBoundary.tsx
│   │   ├── ImageCarousel.tsx
│   │   ├── Loading.tsx
│   │   ├── Skeleton.tsx
│   │   └── ThemeToggle.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── CommandPalette.tsx
│       ├── DataTable.tsx
│       ├── Modal.tsx
│       └── Toast.tsx
├── context/
│   ├── AppContext.tsx      # Global state (user, plans, theme)
│   ├── hooks.ts
│   └── types.ts
├── contexts/
│   ├── I18nContext.tsx
│   └── ThemeContext.tsx
├── data/
│   ├── carouselData.ts     # Deprecated
│   ├── hospitalData.ts
│   ├── membersData.ts
│   ├── newCarouselData.ts  # Active carousel data
│   ├── plansData.ts
│   └── teamData.ts
├── design-system/
│   ├── context.ts
│   ├── hooks.ts
│   ├── provider.tsx
│   └── tokens.ts
├── hooks/
│   ├── advanced.ts
│   ├── performance.ts
│   ├── useCarousel.ts
│   ├── useCommandPalette.ts
│   ├── useIntersectionObserver.ts
│   ├── useMembershipForm.ts
│   ├── useOffline.ts
│   └── useTheme.ts
├── pages/
│   └── HomePage.tsx
├── services/
│   └── api/
│       └── membershipAPI.ts   # Django REST API integration
├── store/
│   ├── appStore.ts            # Empty (migration pending)
│   └── carouselStore.ts       # Zustand + Immer
├── types/
│   ├── api.ts
│   ├── business.ts
│   ├── components.ts
│   ├── index.ts               # Barrel export
│   ├── membership.ts
│   ├── navigation.ts
│   ├── ui.ts
│   └── utils.ts
├── utils/
│   ├── api.ts
│   ├── cache.ts
│   ├── helpers.ts
│   ├── imageOptimization.tsx
│   ├── lazyLoading.tsx
│   ├── memoization.ts
│   ├── pdfGenerator.ts
│   ├── performance.tsx
│   ├── pwa.ts
│   ├── seo.ts
│   └── virtualScrolling.tsx
├── App.tsx
├── main.tsx
└── index.css
```

### Form Structure (3 Steps)

1. **Personal Information** - Proposal info (auto-generate), membership type, personal details, email
2. **Address & Nominee** - Present/permanent address + 3 nominees with ID proofs
3. **Physical & Review** - Measurements, medical history + complete review & declaration

## API Integration

### Backend Requirements

Django REST API should provide:

Copyright © 2024 Bright Life Bangladesh Ltd. (IT & Tech Department). All Rights Reserved.

This project is proprietary and confidential. Unauthorized copying, distribution, or use of this software, via any medium, is strictly prohibited.So,don't use it  directly for your work
