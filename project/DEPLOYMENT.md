# AI Global Experts - Deployment Guide

This guide explains how to deploy the AI Global Experts website to various hosting providers.

## Project Overview

AI Global Experts is a static single-page application built with React and Vite. The site features:

- Dynamic homepage content managed through Supabase CMS (pages and blocks system)
- Contact form with email notifications via Resend API
- Security Scan request form with email notifications
- Responsive design with modern styling
- Client-side routing with React Router

## Architecture

The application consists of:

1. **Frontend**: React SPA with client-side routing
2. **Database**: Supabase PostgreSQL for content and form submissions
3. **Email Notifications**: Supabase Edge Function that calls Resend API
4. **Deployment**: Static files served via any web server

**No server-side processing is required on your hosting provider.**

## Prerequisites

Before deploying, ensure you have:
- Built the production files (the `dist` folder should contain your site)
- Access to your PHP hosting control panel (cPanel, FTP, or file manager)
- Your Supabase project is running and accessible

## Deployment Steps

### Step 1: Prepare Files

The production-ready files are located in the `dist` folder. This folder contains:
- `index.html` - Main HTML file
- `assets/` folder - All JavaScript and CSS files
- `.htaccess` - Apache configuration for routing
- SVG logo files
- `_redirects` - Netlify redirects (not needed for PHP hosting)

### Step 2: Access Your Hosting

Connect to your PHP hosting using one of these methods:
- **FTP Client** (FileZilla, Cyberduck, etc.)
- **cPanel File Manager**
- **SFTP** (if provided by your host)

### Step 3: Upload Files

1. Navigate to your web root directory (usually `public_html`, `www`, or `htdocs`)
2. Upload **ALL contents** from the `dist` folder to this directory
3. Ensure the folder structure is preserved:
   ```
   public_html/
   ├── index.html
   ├── .htaccess
   ├── assets/
   │   ├── index-12KjRoTE.css
   │   └── index-fCgB5rpY.js
   ├── AI-GE logo svg.svg
   └── AI-GE-logo-branded.svg
   ```

**Important:** Upload the **contents** of the dist folder, not the dist folder itself.

### Step 4: Verify .htaccess File

The `.htaccess` file is crucial for making your single-page application work correctly. It:
- Redirects all requests to `index.html` (enables React Router navigation)
- Sets proper MIME types for JavaScript files
- Enables GZIP compression
- Adds caching headers for better performance
- Includes security headers

**Note:** If your hosting doesn't support `.htaccess` (Apache), you may need to:
- Contact your hosting provider for alternative configuration
- Use Nginx configuration if available
- Switch to a hosting provider that supports Apache

### Step 5: Configure Supabase CORS

Your Supabase database needs to allow requests from your production domain:

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project: `chbgtwjweisifwpyysau`
3. Navigate to: Settings → API
4. Under "API Settings", find "Additional Allowed Origins"
5. Add your production domain (e.g., `https://yourdomain.com`)
6. Click "Save"

**Note:** Supabase allows all origins by default, but it's good practice to explicitly set your production domain.

### Step 6: Test Your Deployment

After uploading, test the following:

1. **Homepage loads correctly**
   - Visit: `https://yourdomain.com`
   - Verify the dynamic homepage content loads from Supabase
   - Check that all blocks (hero, rich text, gallery, form CTA) display correctly

2. **Navigation works**
   - Click on "Contact" and "Security Scan" links in the header
   - Verify URLs change and pages load
   - Try refreshing on these pages (should not show 404)
   - Test browser back/forward buttons

3. **Forms submit successfully**
   - Fill out the Contact form and submit
   - Fill out the Security Scan form and submit
   - Verify success messages appear
   - Check your browser console (F12) for any errors
   - Verify submissions appear in your Supabase database
   - Confirm email notifications are received

4. **Check browser console**
   - Press F12 to open developer tools
   - Look for any red errors in the Console tab
   - Ensure no 404 errors for missing files
   - Check Network tab for failed API requests

## Common Issues and Solutions

### Issue: 404 Error on Page Refresh

**Problem:** Refreshing `/contact` or `/security-scan` shows a 404 error.

**Solution:**
- Ensure `.htaccess` file is uploaded correctly
- Verify your hosting supports Apache and `.htaccess` files
- Check that `mod_rewrite` is enabled on your server
- Some hosts require you to enable `.htaccess` in the control panel

### Issue: White Screen / Blank Page

**Problem:** The site loads but shows nothing.

**Solution:**
- Check browser console (F12) for JavaScript errors
- Verify all files in the `assets` folder were uploaded
- Ensure file paths are case-sensitive (Linux servers)
- Check that JavaScript files have correct MIME type

### Issue: Forms Don't Submit

**Problem:** Form submission fails or shows errors.

**Solution:**
- Verify Supabase credentials in the built files (they're embedded during build)
- Check browser console for CORS errors
- Add your domain to Supabase allowed origins (see Step 5)
- Test your Supabase connection directly at: https://chbgtwjweisifwpyysau.supabase.co

### Issue: Images Don't Load

**Problem:** SVG logos or other images are missing.

**Solution:**
- Ensure all files including SVG files were uploaded
- Check file names are correct (case-sensitive on Linux)
- Verify file permissions (should be 644 for files, 755 for folders)

## SSL Certificate (HTTPS)

For production sites, you should enable HTTPS:

1. Most PHP hosting providers offer free SSL certificates (Let's Encrypt)
2. Enable SSL in your hosting control panel
3. Uncomment these lines in your `.htaccess` file to force HTTPS:
   ```apache
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

## Environment Variables

Your Supabase credentials are already embedded in the built JavaScript files during the build process. The values from your `.env` file are compiled into the production bundle, so you don't need to configure environment variables on your PHP hosting.

**Current Supabase Configuration:**
- URL: `https://chbgtwjweisifwpyysau.supabase.co`
- Anon Key: Embedded in the production build

## Updating Your Site

When you make changes to your site:

1. Make changes to your source code locally
2. Run `npm run build` to create new production files
3. Upload the **entire contents** of the new `dist` folder to your hosting
4. Overwrite all existing files

**Tip:** Keep your `.htaccess` file if you've made custom modifications.

## Need Help?

If you encounter issues:
1. Check your browser console (F12) for error messages
2. Verify all files were uploaded correctly
3. Test your Supabase connection separately
4. Contact your hosting provider about `.htaccess` support
5. Ensure your hosting supports modern web applications

## Technical Details

**What's happening behind the scenes:**
- Your site is pre-built into static HTML, CSS, and JavaScript files
- When visitors load your site, their browser downloads these files
- React Router handles navigation entirely in the browser
- Forms use the Supabase JavaScript client to send data directly to your database
- No server-side processing occurs on your PHP hosting

**Why this works on PHP hosting:**
- You're only serving static files (like images, HTML, CSS, JS)
- PHP hosting can serve any file type, not just PHP files
- The `.htaccess` file handles routing, which Apache supports natively
- All dynamic functionality happens through Supabase's API

## Database Structure

The application uses three main tables in Supabase:

1. **pages** - Stores page metadata (currently only homepage)
   - id, slug, title, seo_title, seo_desc, published, created_at, updated_at

2. **page_blocks** - Stores content blocks for dynamic pages
   - id, page_id, position, block_type (hero, richtext, gallery, form_cta), data (jsonb)

3. **submissions** - Stores form submissions
   - id, kind (contact or security-scan), name, email, company, phone, message, tool_name, target_url, created_at

## Email Notification System

Form submissions trigger email notifications through:

1. Database trigger on the `submissions` table
2. Supabase Edge Function `notify-submission`
3. Resend API for email delivery

Emails are sent to the address configured in the edge function secrets.

## File Checklist

Before going live, ensure these files are present on your server:

- [ ] index.html (root level)
- [ ] .htaccess (root level)
- [ ] assets/ folder with CSS and JS bundles
- [ ] AI-GE logo svg.svg
- [ ] AI-GE-logo-branded.svg

## Support

Your application is successfully configured for PHP-based hosting. Follow these instructions carefully, and your site will work perfectly without requiring Node.js on the server.
