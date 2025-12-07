# CI/CD Configuration for BrightLife TypeScript App

## Overview
This project uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD).

## Pipeline Structure

### 🔄 Continuous Integration (CI)
Runs on every push to `main`/`develop` branches and pull requests:

- **Multi-Node Testing**: Tests on Node.js 18.x and 20.x
- **Code Quality**: ESLint linting
- **Type Safety**: TypeScript type checking
- **Testing**: Unit tests (placeholder for now)
- **Build Verification**: Production build test
- **Artifact Storage**: Build files saved for deployment

### 🚀 Continuous Deployment (CD)
Runs only on pushes to `main` branch:

- **Production Build**: Optimized build for deployment
- **Deployment Options**: Ready for GitHub Pages, Netlify, or Vercel
- **Success Notification**: Confirmation of successful deployment

### 🔒 Security & Quality
Runs security and quality checks:

- **Dependency Audit**: npm security audit
- **Vulnerability Check**: Identifies potential security issues
- **Code Quality**: Ready for SonarCloud integration

## Deployment Options

### GitHub Pages
Uncomment the GitHub Pages section in `.github/workflows/ci-cd.yml`:
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

### Netlify
1. Set up Netlify secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`
2. Uncomment the Netlify section in the workflow

### Vercel
1. Set up Vercel secrets: `VERCEL_TOKEN`, `ORG_ID`, `PROJECT_ID`
2. Uncomment the Vercel section in the workflow

## Required Secrets (if using external deployment)

Add these in GitHub Repository Settings → Secrets and variables → Actions:

- `NETLIFY_AUTH_TOKEN` (for Netlify)
- `NETLIFY_SITE_ID` (for Netlify)
- `VERCEL_TOKEN` (for Vercel)
- `ORG_ID` (for Vercel)
- `PROJECT_ID` (for Vercel)
- `SONAR_TOKEN` (for SonarCloud)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run type-check` - TypeScript type checking
- `npm run lint` - ESLint code linting
- `npm run test` - Run tests (placeholder)
- `npm run preview` - Preview production build

## Branch Strategy

- **main**: Production-ready code, triggers deployment
- **develop**: Development branch for feature integration
- **feature/***: Feature branches, create PRs to develop

## Status Badges

Add these to your README.md:

```markdown
![CI/CD](https://github.com/yeasin-dev-me/brightlife-typescript-app/workflows/CI/CD%20Pipeline/badge.svg)
![Build Status](https://github.com/yeasin-dev-me/brightlife-typescript-app/workflows/CI/CD%20Pipeline/badge.svg?branch=main)
```

## Next Steps

1. **Add Tests**: Integrate Vitest or Jest for unit testing
2. **Add E2E Tests**: Consider Playwright or Cypress
3. **Environment Variables**: Set up environment-specific configurations
4. **Monitoring**: Add application monitoring and error tracking
5. **Performance**: Add Lighthouse CI for performance monitoring

## Troubleshooting

- Check GitHub Actions tab for build logs
- Ensure all dependencies are properly declared in package.json
- Verify TypeScript configuration for build compatibility
- Check deployment platform documentation for specific requirements