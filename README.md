# BrightLife TypeScript App

A modern React TypeScript application with comprehensive features including virtual scrolling, performance optimizations, and GitHub Pages deployment.

## 🚀 Features

- **React 19** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Virtual Scrolling** components for large datasets
- **Performance Optimizations** with memoization and lazy loading
- **GitHub Pages Deployment** with automated CI/CD
- **Modern UI Components** with accessibility support
- **State Management** with Zustand
- **Comprehensive Testing** setup

## 🛠️ Technologies Used

- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.2
- Zustand for state management
- Tailwind CSS for styling
- ESLint 9.33.0 for code quality

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ya-shuvo30/brightlife-typescript-app.git

# Navigate to project directory
cd brightlife-typescript-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🌐 Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions. Every push to the main branch triggers a deployment.

### Custom Domain Setup

1. Update the `public/CNAME` file with your domain
2. Configure DNS in Cloudflare:
   - Add CNAME record pointing to `ya-shuvo30.github.io`
3. Enable GitHub Pages in repository settings

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── sections/       # Page sections
│   ├── shared/         # Shared components
│   └── forms/          # Form components
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── store/              # State management
└── assets/             # Static assets
```

## 📝 License

This project is licensed under the MIT License.
