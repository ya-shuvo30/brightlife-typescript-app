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
├── components/
│   ├── forms/membership/    # Multi-step membership form
│   ├── sections/            # Homepage sections  
│   ├── shared/              # Reusable components
│   └── ui/                  # UI primitives
├── hooks/                   # Custom React hooks
├── services/api/            # API integration layer
├── types/                   # TypeScript definitions
├── utils/                   # Helper functions
└── store/                   # Zustand state management
```

## API Integration

### Backend Requirements

Django REST API should provide:

Copyright © 2024 Bright Life Bangladesh Ltd. (IT & Tech Department). All Rights Reserved.

This project is proprietary and confidential. Unauthorized copying, distribution, or use of this software, via any medium, is strictly prohibited.So,don't use it  directly for your work
