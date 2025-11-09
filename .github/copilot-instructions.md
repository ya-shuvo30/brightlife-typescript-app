# Copilot Instructions for BrightLife TypeScript App

## Project Architecture

**Type**: React 19 SPA with TypeScript, deployed to GitHub Pages  
**Stack**: Vite + React 19.1 + TypeScript 5.8 + Tailwind CSS + Zustand

### Key Architectural Patterns

1. **Dual State Management**: This codebase uses BOTH Context API (`src/context/AppContext.tsx`) and Zustand (`src/store/carouselStore.ts`). Use Context for global app state (user, plans, UI), Zustand for feature-specific state (carousel). Empty `appStore.ts` indicates migration in progress.

2. **Path Aliases**: Always use configured aliases for imports:
   - `@/` → `src/`
   - `@components/` → `src/components/`
   - `@utils/` → `src/utils/`
   - `@types/` → `src/types/`
   - `@hooks/` → `src/hooks/`

3. **Type-First Development**: Types are centralized in `src/types/` and exported through `index.ts`. Import from `@types` barrel exports, not individual files.

## Performance-Critical Patterns

### Inline Styles for Performance
Virtual scrolling (`src/utils/virtualScrolling.tsx`) and carousel components use inline styles intentionally. Do NOT refactor to CSS classes - they require runtime-calculated values like `translateY(${offsetY}px)` for 60fps scrolling.

### Zustand with Immer
Carousel store uses `immer` middleware for immutable state updates:
```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useStore = create<Store>()(
  immer((set) => ({
    // Mutate state directly - immer handles immutability
    increment: () => set((state) => { state.count++ })
  }))
);
```

### Virtual Scrolling
For lists >100 items, use `VirtualList`, `VirtualGrid`, or `VirtualTable` from `@utils/virtualScrolling`. Required props: `items`, `itemHeight`, `containerHeight`, `renderItem`.

## Development Workflow

### Build Commands
- `npm run dev` - Start dev server (Vite)
- `npm run build` - TypeScript compile + Vite build
- `npm run type-check` - Type checking without build
- `npm run lint:fix` - Auto-fix ESLint issues

### TypeScript Configuration
Uses project references (`tsconfig.json` → `tsconfig.app.json` + `tsconfig.node.json`). When adding dependencies, restart TS server if path resolution fails.

### Deployment
Auto-deploys to GitHub Pages on push to `main`. Build includes:
1. Type checking (`tsc --noEmit`)
2. Linting (`eslint .`)
3. Production build (`vite build`)
4. Manual chunks: `vendor` (React/ReactDOM), `utils` (Zustand/Immer)

## Component Patterns

### Lazy Loading
Wrap expensive sections with `LazySection` from `@utils/lazyLoading`:
```tsx
<LazySection threshold={0.1} fallback={<SectionLoadingFallback />}>
  <ExpensiveComponent />
</LazySection>
```

### Error Boundaries
Use `ErrorBoundary` from `@components/shared/ErrorBoundary` around major sections. Already wraps root `App` component.

### Navigation
Scroll-based navigation via `navigateTo` callback in `App.tsx`. No router - single-page with section anchors.

## Conventions

1. **File Extensions**: Always `.tsx` for React components, `.ts` for utilities/types
2. **Component Exports**: Prefer named exports except for page-level components
3. **Type Imports**: Use `import type` for type-only imports
4. **Callbacks**: Wrap in `React.useCallback` with proper dependencies
5. **Async State**: Use `useAsync` hook from `@hooks` for loading/error states

## Common Pitfalls

- Don't import from `src/types/business.ts` directly - use `@types` barrel export
- Carousel uses `carouselSlides` from `data/newCarouselData.ts`, not old `carouselData.ts`
- ESLint allows inline styles for performance - don't over-zealously refactor to CSS modules in virtual scrolling
- GitHub Pages deployment requires `base: '/'` in Vite config (custom domain setup)

## Design System

Custom design system in `src/design-system/`:
- Tokens: `colors`, `typography`, `spacing` from `tokens.ts`
- Provider: `DesignSystemProvider` wraps app for theming
- Tailwind extends with `bright.primary.*` and `bright.success.*` color scales

## Testing Note
Test infrastructure is minimal (`test` script is placeholder). When adding tests, prefer Vitest (already compatible with Vite setup).
