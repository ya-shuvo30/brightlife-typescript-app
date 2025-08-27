/**
 * PWA Manifest Generator
 * Utilities for generating and managing PWA manifest files
 */

export interface PWAManifestConfig {
  name: string;
  shortName: string;
  description: string;
  startUrl?: string;
  display?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation?: 'any' | 'natural' | 'landscape' | 'portrait' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary';
  themeColor?: string;
  backgroundColor?: string;
  scope?: string;
  icons?: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: 'any' | 'maskable' | 'monochrome';
  }>;
  categories?: string[];
  screenshots?: Array<{
    src: string;
    sizes: string;
    type: string;
    platform?: 'wide' | 'narrow';
    label?: string;
  }>;
  shortcuts?: Array<{
    name: string;
    shortName?: string;
    description?: string;
    url: string;
    icons?: Array<{
      src: string;
      sizes: string;
      type?: string;
    }>;
  }>;
  relatedApplications?: Array<{
    platform: string;
    url: string;
    id?: string;
  }>;
  preferRelatedApplications?: boolean;
}

export class PWAManifestGenerator {
  private static readonly DEFAULT_CONFIG: Partial<PWAManifestConfig> = {
    startUrl: '/',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    themeColor: '#000000',
    backgroundColor: '#ffffff'
  };

  /**
   * Generate a complete PWA manifest
   */
  static generateManifest(config: PWAManifestConfig): string {
    const manifest = {
      name: config.name,
      short_name: config.shortName,
      description: config.description,
      start_url: config.startUrl || this.DEFAULT_CONFIG.startUrl,
      display: config.display || this.DEFAULT_CONFIG.display,
      orientation: config.orientation || this.DEFAULT_CONFIG.orientation,
      theme_color: config.themeColor || this.DEFAULT_CONFIG.themeColor,
      background_color: config.backgroundColor || this.DEFAULT_CONFIG.backgroundColor,
      scope: config.scope || this.DEFAULT_CONFIG.scope,
      icons: config.icons || this.getDefaultIcons(),
      categories: config.categories || ['lifestyle', 'health'],
      screenshots: config.screenshots,
      shortcuts: config.shortcuts,
      related_applications: config.relatedApplications,
      prefer_related_applications: config.preferRelatedApplications || false
    };

    // Remove undefined values
    const cleanManifest = Object.fromEntries(
      Object.entries(manifest).filter(([, value]) => value !== undefined)
    );

    return JSON.stringify(cleanManifest, null, 2);
  }

  /**
   * Generate default icon set for PWA
   */
  private static getDefaultIcons() {
    const sizes = ['72', '96', '128', '144', '152', '192', '384', '512'];
    return sizes.map(size => ({
      src: `/icons/icon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose: 'any'
    }));
  }

  /**
   * Generate icon configurations for different purposes
   */
  static generateIconConfigs(basePath: string = '/icons'): Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: 'any' | 'maskable' | 'monochrome';
  }> {
    const configs: Array<{
      src: string;
      sizes: string;
      type: string;
      purpose?: 'any' | 'maskable' | 'monochrome';
    }> = [];
    
    // Standard icons
    const standardSizes = ['72', '96', '128', '144', '152', '192', '384', '512'];
    standardSizes.forEach(size => {
      configs.push({
        src: `${basePath}/icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'any'
      });
    });

    // Maskable icons (for adaptive icons on Android)
    const maskableSizes = ['192', '512'];
    maskableSizes.forEach(size => {
      configs.push({
        src: `${basePath}/maskable-icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'maskable'
      });
    });

    return configs;
  }

  /**
   * Generate shortcuts for PWA
   */
  static generateShortcuts(): Array<{
    name: string;
    shortName?: string;
    description?: string;
    url: string;
    icons?: Array<{
      src: string;
      sizes: string;
      type?: string;
    }>;
  }> {
    return [
      {
        name: 'Quick Health Check',
        shortName: 'Health Check',
        description: 'Perform a quick health assessment',
        url: '/health-check',
        icons: [{
          src: '/icons/shortcut-health.png',
          sizes: '96x96',
          type: 'image/png'
        }]
      },
      {
        name: 'Track Progress',
        shortName: 'Progress',
        description: 'View your health progress',
        url: '/progress',
        icons: [{
          src: '/icons/shortcut-progress.png',
          sizes: '96x96',
          type: 'image/png'
        }]
      },
      {
        name: 'Find Providers',
        shortName: 'Providers',
        description: 'Find healthcare providers near you',
        url: '/providers',
        icons: [{
          src: '/icons/shortcut-providers.png',
          sizes: '96x96',
          type: 'image/png'
        }]
      }
    ];
  }

  /**
   * Generate screenshots for app stores
   */
  static generateScreenshots(): Array<{
    src: string;
    sizes: string;
    type: string;
    platform?: 'wide' | 'narrow';
    label?: string;
  }> {
    return [
      {
        src: '/screenshots/desktop-home.png',
        sizes: '1280x720',
        type: 'image/png',
        platform: 'wide',
        label: 'Desktop Home Screen'
      },
      {
        src: '/screenshots/desktop-dashboard.png',
        sizes: '1280x720',
        type: 'image/png',
        platform: 'wide',
        label: 'Desktop Dashboard'
      },
      {
        src: '/screenshots/mobile-home.png',
        sizes: '390x844',
        type: 'image/png',
        platform: 'narrow',
        label: 'Mobile Home Screen'
      },
      {
        src: '/screenshots/mobile-dashboard.png',
        sizes: '390x844',
        type: 'image/png',
        platform: 'narrow',
        label: 'Mobile Dashboard'
      }
    ];
  }

  /**
   * Validate manifest configuration
   */
  static validateManifest(config: PWAManifestConfig): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!config.name) errors.push('Name is required');
    if (!config.shortName) errors.push('Short name is required');
    if (!config.description) errors.push('Description is required');

    // Name length checks
    if (config.name && config.name.length > 45) {
      warnings.push('Name should be 45 characters or less for better display');
    }
    if (config.shortName && config.shortName.length > 12) {
      warnings.push('Short name should be 12 characters or less');
    }

    // Icon checks
    if (!config.icons || config.icons.length === 0) {
      warnings.push('At least one icon should be provided');
    } else {
      const hasLargeIcon = config.icons.some(icon => {
        const size = parseInt(icon.sizes.split('x')[0]);
        return size >= 192;
      });
      if (!hasLargeIcon) {
        warnings.push('At least one icon should be 192x192 or larger');
      }
    }

    // Color format checks
    if (config.themeColor && !this.isValidColor(config.themeColor)) {
      errors.push('Theme color should be a valid CSS color');
    }
    if (config.backgroundColor && !this.isValidColor(config.backgroundColor)) {
      errors.push('Background color should be a valid CSS color');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if a color is valid CSS color
   */
  private static isValidColor(color: string): boolean {
    // Simple check for hex colors and named colors
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const namedColors = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown', 'gray', 'grey'];
    
    return hexRegex.test(color) || namedColors.includes(color.toLowerCase()) || color.startsWith('rgb') || color.startsWith('hsl');
  }

  /**
   * Get BrightLife default manifest configuration
   */
  static getBrightLifeManifest(): PWAManifestConfig {
    return {
      name: 'BrightLife Health Platform',
      shortName: 'BrightLife',
      description: 'Your comprehensive health and wellness companion. Track your health, find providers, and manage your wellness journey.',
      startUrl: '/',
      display: 'standalone',
      orientation: 'portrait',
      themeColor: '#059669',
      backgroundColor: '#ffffff',
      scope: '/',
      categories: ['health', 'medical', 'lifestyle', 'productivity'],
      icons: this.generateIconConfigs(),
      shortcuts: this.generateShortcuts(),
      screenshots: this.generateScreenshots()
    };
  }
}
