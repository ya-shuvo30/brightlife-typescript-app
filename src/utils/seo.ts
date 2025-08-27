import { useEffect } from 'react';

/**
 * SEO Utilities and Hooks
 * Provides comprehensive SEO // Main SEO hook
export const useSEO = (seoData: Partial<SEOData> = {}) => {
  const finalSEO = useMemo(() => ({ ...defaultSEO, ...seoData }), [seoData]);a tag management
 */

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  robots?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    type?: string;
    url?: string;
    image?: string;
    siteName?: string;
    locale?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  structuredData?: Record<string, unknown>;
}

// Default SEO configuration
export const defaultSEO: SEOData = {
  title: 'Brightlife - Modern React TypeScript App',
  description: 'A modern, performant React application built with TypeScript, featuring cutting-edge optimization techniques and best practices.',
  keywords: ['React', 'TypeScript', 'Performance', 'Modern Web', 'PWA'],
  author: 'Brightlife Team',
  robots: 'index,follow',
  openGraph: {
    type: 'website',
    siteName: 'Brightlife',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image'
  }
};

// Update document title
const updateTitle = (title: string) => {
  if (typeof document !== 'undefined') {
    document.title = title;
  }
};

// Update meta tag
const updateMetaTag = (name: string, content: string, property = false) => {
  if (typeof document === 'undefined') return;

  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.querySelector(selector) as HTMLMetaElement;

  if (!element) {
    element = document.createElement('meta');
    if (property) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

// Update link tag
const updateLinkTag = (rel: string, href: string) => {
  if (typeof document === 'undefined') return;

  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

// Update structured data
const updateStructuredData = (data: Record<string, unknown>) => {
  if (typeof document === 'undefined') return;

  const id = 'structured-data';
  let element = document.getElementById(id) as HTMLScriptElement;

  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
};

// Main SEO hook
export const useSEO = (seoData: Partial<SEOData> = {}) => {
  const finalSEO = { ...defaultSEO, ...seoData };

  useEffect(() => {
    // Update title
    if (finalSEO.title) {
      updateTitle(finalSEO.title);
    }

    // Update basic meta tags
    if (finalSEO.description) {
      updateMetaTag('description', finalSEO.description);
    }

    if (finalSEO.keywords && finalSEO.keywords.length > 0) {
      updateMetaTag('keywords', finalSEO.keywords.join(', '));
    }

    if (finalSEO.author) {
      updateMetaTag('author', finalSEO.author);
    }

    if (finalSEO.robots) {
      updateMetaTag('robots', finalSEO.robots);
    }

    // Update Open Graph tags
    if (finalSEO.openGraph) {
      const og = finalSEO.openGraph;
      
      if (og.title) updateMetaTag('og:title', og.title, true);
      if (og.description) updateMetaTag('og:description', og.description, true);
      if (og.type) updateMetaTag('og:type', og.type, true);
      if (og.url) updateMetaTag('og:url', og.url, true);
      if (og.image) updateMetaTag('og:image', og.image, true);
      if (og.siteName) updateMetaTag('og:site_name', og.siteName, true);
      if (og.locale) updateMetaTag('og:locale', og.locale, true);
    }

    // Update Twitter Card tags
    if (finalSEO.twitter) {
      const twitter = finalSEO.twitter;
      
      if (twitter.card) updateMetaTag('twitter:card', twitter.card);
      if (twitter.site) updateMetaTag('twitter:site', twitter.site);
      if (twitter.creator) updateMetaTag('twitter:creator', twitter.creator);
      if (twitter.title) updateMetaTag('twitter:title', twitter.title);
      if (twitter.description) updateMetaTag('twitter:description', twitter.description);
      if (twitter.image) updateMetaTag('twitter:image', twitter.image);
    }

    // Update canonical URL
    if (finalSEO.canonical) {
      updateLinkTag('canonical', finalSEO.canonical);
    }

    // Update structured data
    if (finalSEO.structuredData) {
      updateStructuredData(finalSEO.structuredData);
    }

    // Viewport meta tag for mobile
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
    // Theme color meta tag
    updateMetaTag('theme-color', '#ffffff');
    
    // Apple mobile web app meta tags
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    
  }, [finalSEO]);

  return finalSEO;
};

// Page-specific SEO hook
export const usePageSEO = (pageData: {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  image?: string;
}) => {
  const seoData: Partial<SEOData> = {
    title: `${pageData.title} | Brightlife`,
    description: pageData.description,
    canonical: pageData.canonical,
    keywords: pageData.keywords,
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: pageData.canonical,
      image: pageData.image
    },
    twitter: {
      title: pageData.title,
      description: pageData.description,
      image: pageData.image
    }
  };

  return useSEO(seoData);
};

// Generate structured data for different content types
export const generateStructuredData = {
  website: (data: {
    name: string;
    url: string;
    description: string;
    author?: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    description: data.description,
    ...(data.author && {
      author: {
        '@type': 'Person',
        name: data.author
      }
    })
  }),

  webApplication: (data: {
    name: string;
    url: string;
    description: string;
    applicationCategory: string;
    operatingSystem?: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: data.name,
    url: data.url,
    description: data.description,
    applicationCategory: data.applicationCategory,
    ...(data.operatingSystem && { operatingSystem: data.operatingSystem })
  }),

  breadcrumbList: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  })
};

// SEO utility functions
export const seoUtils = {
  // Generate meta tags for SSR
  generateMetaTags: (seoData: SEOData) => {
    const tags: Array<{ name?: string; property?: string; content: string }> = [];

    if (seoData.description) {
      tags.push({ name: 'description', content: seoData.description });
    }

    if (seoData.keywords?.length) {
      tags.push({ name: 'keywords', content: seoData.keywords.join(', ') });
    }

    if (seoData.author) {
      tags.push({ name: 'author', content: seoData.author });
    }

    if (seoData.robots) {
      tags.push({ name: 'robots', content: seoData.robots });
    }

    // Open Graph tags
    if (seoData.openGraph) {
      const og = seoData.openGraph;
      if (og.title) tags.push({ property: 'og:title', content: og.title });
      if (og.description) tags.push({ property: 'og:description', content: og.description });
      if (og.type) tags.push({ property: 'og:type', content: og.type });
      if (og.url) tags.push({ property: 'og:url', content: og.url });
      if (og.image) tags.push({ property: 'og:image', content: og.image });
      if (og.siteName) tags.push({ property: 'og:site_name', content: og.siteName });
      if (og.locale) tags.push({ property: 'og:locale', content: og.locale });
    }

    // Twitter Card tags
    if (seoData.twitter) {
      const twitter = seoData.twitter;
      if (twitter.card) tags.push({ name: 'twitter:card', content: twitter.card });
      if (twitter.site) tags.push({ name: 'twitter:site', content: twitter.site });
      if (twitter.creator) tags.push({ name: 'twitter:creator', content: twitter.creator });
      if (twitter.title) tags.push({ name: 'twitter:title', content: twitter.title });
      if (twitter.description) tags.push({ name: 'twitter:description', content: twitter.description });
      if (twitter.image) tags.push({ name: 'twitter:image', content: twitter.image });
    }

    return tags;
  },

  // Validate SEO data
  validateSEO: (seoData: SEOData) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Title validation
    if (!seoData.title) {
      errors.push('Title is required');
    } else if (seoData.title.length > 60) {
      warnings.push('Title should be under 60 characters for optimal SEO');
    }

    // Description validation
    if (!seoData.description) {
      errors.push('Description is required');
    } else if (seoData.description.length > 160) {
      warnings.push('Description should be under 160 characters for optimal SEO');
    }

    // Image validation for social sharing
    if (seoData.openGraph?.image && !seoData.openGraph.image.startsWith('http')) {
      warnings.push('Open Graph image should be an absolute URL');
    }

    return { errors, warnings, isValid: errors.length === 0 };
  }
};
