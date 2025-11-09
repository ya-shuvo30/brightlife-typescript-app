# Custom Domain Setup Guide for GitHub Pages

This guide will walk you through connecting a custom domain to your GitHub Pages site.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Step 1: Configure Your Domain in the Repository](#step-1-configure-your-domain-in-the-repository)
- [Step 2: Configure DNS Settings](#step-2-configure-dns-settings)
- [Step 3: Enable GitHub Pages](#step-3-enable-github-pages)
- [Step 4: Verify Domain Connection](#step-4-verify-domain-connection)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:
- A custom domain (e.g., `www.brightlifebd.com`)
- Access to your domain's DNS settings (through your domain registrar or DNS provider like Cloudflare)
- Admin access to your GitHub repository
- The site successfully building and deploying via GitHub Actions

## Step 1: Configure Your Domain in the Repository

### 1.1 Update the CNAME File

The CNAME file tells GitHub Pages which custom domain to use for your site.

1. Navigate to the `public/` directory in your repository
2. Open or create the `CNAME` file
3. Add your custom domain (without `https://` or trailing slash):

```
www.brightlifebd.com
```

**Important Notes:**
- For apex domains (e.g., `example.com`), use just the domain name
- For subdomains (e.g., `www.example.com`), include the subdomain
- Only one domain per CNAME file
- No protocol (http/https) or paths

### 1.2 Verify Vite Configuration

Ensure your `vite.config.ts` has the correct `base` setting:

```typescript
export default defineConfig({
  base: '/', // For custom domains, use '/'
  // ... other config
})
```

**Note:** If you were using GitHub Pages without a custom domain, the base would be `'/repository-name/'`. With a custom domain, it should be `'/'`.

### 1.3 Commit and Push Changes

```bash
git add public/CNAME vite.config.ts
git commit -m "Configure custom domain"
git push origin main
```

The GitHub Actions workflow will automatically build and deploy your changes.

## Step 2: Configure DNS Settings

You need to point your domain to GitHub's servers. The exact steps depend on whether you're using an apex domain or a subdomain.

### Option A: Subdomain (Recommended - e.g., www.example.com)

Configure a **CNAME record** in your DNS settings:

| Type  | Name | Target/Value           | TTL  |
|-------|------|------------------------|------|
| CNAME | www  | ya-shuvo30.github.io   | Auto |

**Steps for Cloudflare:**
1. Log in to your Cloudflare dashboard
2. Select your domain
3. Go to DNS → Records
4. Click "Add record"
5. Select type: **CNAME**
6. Name: **www** (or your subdomain)
7. Target: **ya-shuvo30.github.io**
8. Proxy status: DNS only (gray cloud) - recommended for initial setup
9. Click Save

### Option B: Apex Domain (e.g., example.com)

Configure **A records** pointing to GitHub's IP addresses:

| Type | Name | Target/Value      | TTL  |
|------|------|-------------------|------|
| A    | @    | 185.199.108.153   | Auto |
| A    | @    | 185.199.109.153   | Auto |
| A    | @    | 185.199.110.153   | Auto |
| A    | @    | 185.199.111.153   | Auto |

**Optional:** Add a CNAME record for the www subdomain:

| Type  | Name | Target/Value      | TTL  |
|-------|------|-------------------|------|
| CNAME | www  | ya-shuvo30.github.io | Auto |

### DNS Propagation

DNS changes can take anywhere from a few minutes to 48 hours to propagate globally. You can check propagation status at:
- https://dnschecker.org
- https://www.whatsmydns.net

## Step 3: Enable GitHub Pages

### 3.1 Repository Settings

1. Go to your GitHub repository
2. Click on **Settings**
3. Scroll down to **Pages** in the left sidebar
4. Under "Build and deployment":
   - Source: **GitHub Actions** (should already be selected)
   - Branch: **main** (or your default branch)

### 3.2 Configure Custom Domain in GitHub

1. In the same Pages settings
2. Under "Custom domain", enter your domain: `www.brightlifebd.com`
3. Click **Save**
4. GitHub will automatically check the DNS configuration

### 3.3 Enable HTTPS (Recommended)

Once DNS is configured and GitHub verifies your domain:

1. In Pages settings, check **Enforce HTTPS**
2. This may take a few minutes to become available
3. GitHub will automatically provision an SSL certificate via Let's Encrypt

**Note:** HTTPS enforcement might not be immediately available. Wait for DNS propagation and domain verification to complete.

## Step 4: Verify Domain Connection

### 4.1 Check GitHub Status

In your repository's Pages settings, you should see:
- ✅ DNS check successful
- Your site is live at `https://www.brightlifebd.com`

### 4.2 Test Your Site

1. Open a browser
2. Navigate to your custom domain
3. Verify the site loads correctly
4. Check that HTTPS is working (padlock icon in browser)

### 4.3 Test Both Domain Variants

- `http://www.brightlifebd.com` → Should redirect to HTTPS
- `https://www.brightlifebd.com` → Should load your site
- `http://brightlifebd.com` → Should redirect to www (if configured)

## Troubleshooting

### Issue: "Domain's DNS record could not be retrieved"

**Solutions:**
1. Wait for DNS propagation (up to 48 hours)
2. Verify your DNS records are correctly configured
3. Check that the CNAME file in your repository matches the domain in GitHub settings
4. Try removing and re-adding the custom domain in GitHub settings

### Issue: "CNAME already taken"

**Solution:**
This means another GitHub repository is using this domain. Ensure:
1. You haven't configured the same domain in another repository
2. If you transferred the domain, remove it from the old repository first

### Issue: Site shows 404 error

**Solutions:**
1. Verify the CNAME file is in the `public/` directory
2. Check that the build process copies the CNAME file to `dist/`
3. Verify `vite.config.ts` has `base: '/'`
4. Check GitHub Actions deployment was successful
5. Clear your browser cache and try again

### Issue: CSS/JS not loading (404 errors)

**Solution:**
Your base path is likely incorrect:
1. For custom domains, use `base: '/'` in `vite.config.ts`
2. For `username.github.io/repo-name`, use `base: '/repo-name/'`

### Issue: HTTPS not available

**Solutions:**
1. Wait for DNS propagation to complete
2. Ensure "Enforce HTTPS" is checked in repository settings
3. GitHub needs time to provision the SSL certificate (can take up to 24 hours)
4. Verify your DNS records point to GitHub's servers

### Issue: Domain verification fails

**Solutions:**
1. Check DNS records are correctly configured
2. Ensure CNAME file contains only the domain name (no protocol, no trailing slash)
3. Wait for DNS propagation
4. Try these commands to verify DNS:
   ```bash
   # Check CNAME record
   dig www.brightlifebd.com CNAME
   
   # Check A record
   dig brightlifebd.com A
   ```

### Issue: Site works but images/assets don't load

**Solution:**
Verify your asset paths:
1. Use relative paths or absolute paths from root (`/assets/...`)
2. Avoid hardcoded domains in asset URLs
3. Check the browser console for 404 errors

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- [Vite Configuration Reference](https://vitejs.dev/config/)

## Quick Reference

### Current Configuration

- **Repository**: ya-shuvo30/brightlife-typescript-app
- **Domain**: www.brightlifebd.com
- **GitHub Pages URL**: ya-shuvo30.github.io
- **CNAME File**: `public/CNAME`
- **Vite Base**: `/`
- **Deploy Method**: GitHub Actions

### DNS Configuration Template (Cloudflare)

For subdomain (www):
```
Type: CNAME
Name: www
Target: ya-shuvo30.github.io
Proxy: DNS only (for initial setup)
```

For apex domain:
```
Type: A
Name: @
Target: 185.199.108.153
```
(Repeat for all four GitHub IPs)

## Support

If you encounter issues not covered in this guide:
1. Check the GitHub Actions workflow logs for build/deployment errors
2. Review the GitHub Pages settings in your repository
3. Consult the [GitHub Community](https://github.community/c/github-pages/36)
4. Check Cloudflare or your DNS provider's documentation
