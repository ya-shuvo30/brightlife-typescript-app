# Copilot Instructions for BrightLife TypeScript App

## Project Overview
**Type**: React 19 SPA with TypeScript for BrightLife Bangladesh health membership platform  
**Stack**: Vite 7.1 + React 19.1 + TypeScript 5.8 + Tailwind CSS 3.4 + Zustand 5.0  
**Deployment**: GitHub Pages with CI/CD (`.github/workflows/deploy.yml`)

## Architecture Fundamentals

### State Management Strategy
**Dual-system approach** - understand when to use each:
- **Context API** (`src/context/AppContext.tsx`): Global app state (user auth, plan data, UI theme, notifications). Uses `useReducer` pattern with typed actions.
- **Zustand** (`src/store/carouselStore.ts`): Feature-scoped state with Immer middleware. Use for isolated features (carousel, forms).
- **⚠️ Migration in progress**: Empty `appStore.ts` exists—don't create new Zustand stores until consolidation decision is made.

```typescript
// Zustand with Immer - mutate state directly
export const useCarouselStore = create<Store>()(
  immer((set) => ({
    nextSlide: () => set((state) => { 
      state.currentSlide = (state.currentSlide + 1) % state.totalSlides;
    })
  }))
);
```

### Module Resolution & Imports
**Critical**: Always use path aliases defined in `vite.config.ts`:
```typescript
import { Plan } from '@types';              // ✅ Correct - barrel export
import { useAsync } from '@hooks';          // ✅ Correct - barrel export  
import { VirtualList } from '@utils/virtualScrolling'; // ✅ Specific import

import { Plan } from '@types/business';     // ❌ Wrong - bypasses barrel
import { Plan } from '../../../types/business'; // ❌ Wrong - no relative paths
```

**Type exports** (`src/types/index.ts`): Re-exports from `business`, `api`, `ui`, `navigation`, `utils`, `components`. Always import from `@types`.

### Navigation Architecture
**No React Router** - scroll-based navigation with section anchors:
- `navigateTo('section-id')` in `App.tsx` smoothly scrolls to `<section id="section-id">`
- Uses `document.getElementById()` with error handling
- URL structure is static (GitHub Pages constraint)

## Performance Patterns (Non-Negotiable)

### Inline Styles for Dynamic Values
`src/utils/virtualScrolling.tsx` and carousel components use **inline styles intentionally**:
```tsx
// ✅ Correct - runtime-calculated positions
<div style={{ transform: `translateY(${offsetY}px)` }}>

// ❌ Don't refactor to CSS classes - breaks 60fps scrolling
```
**Why**: Virtual scrolling requires pixel-perfect positioning recalculated on every scroll event. CSS-in-JS or class switching causes layout thrashing.

### Virtual Scrolling Components
For lists >100 items, use `VirtualList`, `VirtualGrid`, or `VirtualTable`:
```tsx
<VirtualList 
  items={data} 
  itemHeight={80} 
  containerHeight={600}
  overscan={5}  // Renders 5 extra items above/below viewport
  renderItem={(item, index) => <ItemComponent key={item.id} {...item} />}
/>
```

### Lazy Loading Pattern
Wrap expensive sections with `LazySection` from `@utils/lazyLoading`:
```tsx
<LazySection threshold={0.1} fallback={<SkeletonCard />}>
  <NetworkHospital />  {/* Heavy component with map data */}
</LazySection>
```

## Development Workflow

### Essential Commands
```bash
npm run dev          # Vite dev server with HMR
npm run build        # tsc -b && vite build (production)
npm run type-check   # Type-only check without build
npm run lint:fix     # Auto-fix ESLint issues
```

### TypeScript Project References
Uses **project references** for faster builds:
- `tsconfig.json` → orchestrates `tsconfig.app.json` + `tsconfig.node.json`
- `tsconfig.app.json`: React app code (`src/**`)
- `tsconfig.node.json`: Vite config & build tools

**If path resolution fails**: Restart TypeScript server (`cmd/ctrl + shift + P` → "TypeScript: Restart TS Server")

### CI/CD Pipeline (`.github/workflows/deploy.yml`)
Runs on every push to `main`:
1. Type check (`npx tsc --noEmit`)
2. Lint (`npm run lint`)
3. Build (`npm run build` with manual chunks)
4. Deploy to GitHub Pages

**Manual chunks** (Vite config):
```javascript
manualChunks: {
  vendor: ['react', 'react-dom'],  // 200KB - cached separately
  utils: ['zustand', 'immer']      // 50KB - updates less often
}
```

## Component Architecture

### Component Organization (`src/components/`)
```
carousel/     - SimpleCarousel with Zustand state
compound/     - Reusable Card, Modal (compound components)
demo/         - Feature showcases (FormExample, UIShowcase)
enhanced/     - Performance-optimized versions (EnhancedHome, ModernApp)
forms/        - Input, MembershipFormSteps with validation
layout/       - TopBar, Navbar, Footer (persistent layout)
sections/     - Page sections (AboutUs, NetworkHospital, Registration)
shared/       - ErrorBoundary, LoadingSpinner (cross-cutting)
ui/           - Skeleton loaders, ProgressiveLoader (presentational)
```

### Error Boundaries
`ErrorBoundary` from `@components/shared/ErrorBoundary` wraps:
- Root `<App />` component (catches all errors)
- Major sections (optional for graceful degradation)

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <Registration />
</ErrorBoundary>
```

### Custom Hooks Library (`src/hooks/`)
**12 production hooks** exported via barrel (`@hooks/index.ts`):
- `useAsync<T>` - Loading/error states for promises
- `useIntersectionObserver` - Visibility detection (lazy loading)
- `useMediaQuery` - Responsive breakpoints
- `useDebounce` / `useThrottle` - Performance optimization
- `useMembershipForm` - Form state & validation
- See `hooks/advanced.ts` and `hooks/performance.ts` for full list

## Conventions & Patterns

### File Extensions
- `.tsx` - React components (has JSX)
- `.ts` - Utilities, types, hooks (no JSX)

### Export Patterns
```typescript
// Named exports (preferred for most files)
export const Button = () => { /*...*/ };
export const useCustomHook = () => { /*...*/ };

// Default export (only for page-level components)
export default function App() { /*...*/ }
```

### Type Imports
```typescript
import type { Plan, User } from '@types';  // ✅ Type-only import
import { useState } from 'react';          // ✅ Runtime import
```

### Callback Memoization
```typescript
const handleSubmit = React.useCallback((data: FormData) => {
  // Implementation
}, [/* dependencies */]);  // ⚠️ Include all used external values
```

## Design System (`src/design-system/`)

### Tokens (`tokens.ts`)
Centralized design tokens:
```typescript
import { colors, typography, spacing } from '@/design-system/tokens';

// Access: colors.primary[500], typography.heading.h1, spacing.md
```

### Tailwind Extensions (`tailwind.config.js`)
Custom color scales:
```css
bg-bright-primary-500    /* #3b82f6 - main brand color */
text-bright-success-600  /* #22c55e - success states */
```

### Provider
`DesignSystemProvider` wraps app for theming context (in migration - not fully integrated).

## Data Sources

### Carousel Data Migration
```typescript
import { carouselSlides } from '@/data/newCarouselData';  // ✅ Current
import { carouselSlides } from '@/data/carouselData';     // ❌ Deprecated
```

### Static Data Files (`src/data/`)
- `plansData.ts` - Membership plans & pricing
- `hospitalData.ts` - Network hospital locations
- `membersData.ts` - Testimonials & member data
- `teamData.ts` - Team member profiles

## Common Pitfalls

1. **Type imports**: Don't bypass barrel exports (`@types/business` → `@types`)
2. **Inline styles**: Don't refactor virtual scrolling to CSS classes
3. **Router confusion**: No React Router—navigation is scroll-based
4. **Carousel data**: Use `newCarouselData.ts`, not old `carouselData.ts`
5. **Base URL**: GitHub Pages requires `base: '/'` in Vite config (custom domain setup)
6. **Project references**: If path resolution breaks, restart TS server

### Backend Integration

#### Architecture Overview
**Full-stack setup** with Django REST API backend:
- `brightlife-typescript-app/` - React frontend (this repo)
- `Brightlife-Django-Backend/` - Django REST API (sibling directory)
- **Database**: PostgreSQL with Django ORM
- **API**: Django REST Framework with CORS enabled

**Current State**: Frontend configured to connect to Django backend at `http://localhost:8000/api`

#### API Configuration (`src/services/api/membershipAPI.ts`)
```typescript
// Environment-driven API setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'; // Set to false for real API
```

**Environment Variables** (`.env.local`):
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false  # Real backend by default
```

**Mock vs Real API**:
- **Production/Development** (default): `USE_MOCK_API=false` (connects to Django backend)
- **Frontend-only testing**: `USE_MOCK_API=true` (mock mode, no backend required, 1.5s simulated delay)

### Backend Integration

### Architecture Overview
**Monorepo structure** with separate frontend/backend codebases:
- `brightlife-typescript-app/` - React frontend (this repo)
- `brightlife-django-backend/` - Django REST API (sibling directory)

**Current State**: Frontend connects to **real Django backend by default**. Mock API available for testing.

### API Configuration (`src/services/api/membershipAPI.ts`)
```typescript
// Environment-driven API setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'; // Default: false (real backend)
```

**Mock vs Real API**:
- **Production/Development** (default): `USE_MOCK_API=false` (connects to Django backend)
- **Frontend-only testing**: `USE_MOCK_API=true` (mock mode, no backend required, 1.5s simulated delay)

### Backend API Structure (Django)
**Base URL**: `http://localhost:8000/api/` (development)  
**Authentication**: JWT tokens via `djangorestframework-simplejwt`

#### Available Endpoints:
```
POST   /api/auth/token/           # Login (get access + refresh tokens)
POST   /api/auth/token/refresh/   # Refresh access token
POST   /api/auth/token/verify/    # Verify token validity
GET    /api/v1/users/me/          # Current user profile
POST   /api/v1/users/             # User registration (public)
GET    /api/schema/swagger-ui/    # API documentation (dev only)
```

#### CORS Configuration:
Backend allows origins: `http://localhost:3000`, `http://localhost:5173` (Vite dev server)

### Frontend API Client (`src/utils/api.ts`)
Generic `ApiClient` class with TypeScript type safety:
```typescript
const client = new ApiClient('http://localhost:8000/api');

// Type-safe requests
const response = await client.get<Plan[]>('/v1/plans');
const result = await client.post<User, LoginData>('/auth/login', { email, password });
```

**Features**:
- Automatic error handling with `ApiResponse<T>` wrapper
- Type guards: `isApiResponse`, `isPlan`, `isCoreService`
- Async state helpers: `createAsyncState`, `setAsyncLoading`

### Integration Workflow

#### Switching from Mock to Real Backend:
1. **Start Django backend**:
   ```bash
   cd ../brightlife-django-backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver  # Runs on http://localhost:8000
   ```

2. **Configure frontend** (`.env.local`):
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_USE_MOCK_API=false  # Disable mock mode
   ```

3. **Update `membershipAPI.ts`**:
   - Axios instance handles multipart form data for file uploads
   - JWT token stored in localStorage (add `Authorization: Bearer ${token}`)

#### Authentication Flow:
```typescript
// 1. Login to get JWT tokens
const response = await client.post('/auth/token/', { username, password });
const { access, refresh } = response.data;
localStorage.setItem('access_token', access);

// 2. Include token in subsequent requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { Authorization: `Bearer ${access}` }
});
```

### GitHub Repository Management

#### Current Setup:
- **Frontend repo**: `yeasin-dev-me/brightlife-typescript-app` (public, GitHub Pages enabled)
- **Backend repo**: `yeasin-dev-me/Brightlife-Django-Backend` (initialized ✅)

#### Recommended Structure:
**Option 1: Monorepo** (recommended for coordinated development)
```
brightlife-platform/
├── .github/
│   └── workflows/
│       ├── frontend-deploy.yml
│       └── backend-deploy.yml
├── frontend/           # React TypeScript app
├── backend/            # Django REST API
└── README.md          # Monorepo root documentation
```

**Option 2: Separate Repos** (current state)
- **Frontend**: `brightlife-typescript-app` → GitHub Pages (done ✅)
- **Backend**: Create `brightlife-django-backend` → Deploy to Heroku/Railway/AWS

#### Backend Deployment Options:
1. **Railway** (recommended for Django):
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   railway login
   railway init  # In backend directory
   railway up    # Deploy
   ```

2. **Heroku**:
   - Add `Procfile`: `web: gunicorn config.wsgi`
   - Add `runtime.txt`: `python-3.11.x`
   - Push to Heroku Git

3. **Azure App Service** (enterprise option):
   - Use Azure CLI or GitHub Actions
   - Set environment variables in portal

#### Environment Variables Management:
**Frontend** (`.env.local` - never commit):
```env
VITE_API_BASE_URL=https://api.brightlife-bd.com/api  # Production backend
VITE_USE_MOCK_API=false
```

**Backend** (`.env` - never commit):
```env
SECRET_KEY=production-secret-key-here
DEBUG=False
ALLOWED_HOSTS=api.brightlife-bd.com
DATABASE_URL=postgres://user:pass@db-host:5432/brightlife_db
CORS_ALLOWED_ORIGINS=https://yeasin-dev-me.github.io
```

### Integration Checklist
- [x] Create backend GitHub repository
- [ ] Set up PostgreSQL database (local + production)
- [ ] Configure CORS for production frontend domain
- [ ] Deploy backend to hosting service (Railway/Heroku)
- [ ] Update `VITE_API_BASE_URL` to production backend URL
- [ ] Implement JWT token refresh logic in frontend
- [ ] Add API error handling UI (toast notifications)
- [ ] Test file uploads (membership form documents)
- [ ] Set up monitoring (Sentry for errors, LogRocket for sessions)

## Testing (Future)
Test infrastructure is placeholder (`npm test` = echo message). When implementing:
- Use **Vitest** (Vite-native, compatible config)
- Test utilities in `src/utils/` first (pure functions)
- Consider React Testing Library for components
- **API mocking**: Use MSW (Mock Service Worker) for E2E tests without real backend
