# AI Global Experts

A modern, responsive website for AI Global Experts featuring dynamic content management, form submissions with email notifications, and a clean, professional design.

## Features

- **Dynamic Content Management**: Homepage content is managed through Supabase CMS with a flexible block system
- **Contact Form**: Visitors can submit inquiries with automatic email notifications
- **Security Scan Request**: Specialized form for requesting AI tool security assessments
- **Email Notifications**: Automated email alerts via Resend API when forms are submitted
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Modern Stack**: Built with React, Vite, and Supabase for optimal performance

## Technology Stack

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and development server
- **React Router DOM**: Client-side routing
- **CSS**: Custom styling with CSS variables for theming

### Backend & Infrastructure
- **Supabase**: PostgreSQL database, authentication, and edge functions
- **Resend API**: Transactional email delivery
- **Edge Functions**: Serverless functions for email notifications

## Project Structure

```
project/
├── src/
│   ├── components/          # React components
│   │   ├── blocks/         # Content block components (Hero, RichText, Gallery, FormCTA)
│   │   ├── Blocks.jsx      # Block renderer
│   │   ├── Header.jsx      # Site header with navigation
│   │   └── Header.css
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Dynamic homepage
│   │   ├── Contact.jsx     # Contact form page
│   │   ├── SecurityScan.jsx # Security scan request page
│   │   ├── Page.css        # Page layout styles
│   │   └── Form.css        # Form styles
│   ├── lib/
│   │   └── supabase.js     # Supabase client configuration
│   ├── styles/
│   │   ├── site.css        # Global styles
│   │   └── tokens.css      # Design tokens (colors, spacing, typography)
│   └── main.jsx            # Application entry point
├── supabase/
│   ├── functions/          # Edge functions
│   │   └── notify-submission/ # Email notification function
│   └── migrations/         # Database migrations
├── public/                 # Static assets (logos)
├── dist/                   # Production build output
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables
├── DEPLOYMENT.md           # Deployment instructions
└── README.md               # This file
```

## Database Schema

### Tables

#### `pages`
Stores page metadata for content-managed pages.

| Column     | Type      | Description                    |
|------------|-----------|--------------------------------|
| id         | integer   | Primary key                    |
| slug       | text      | URL-friendly page identifier   |
| title      | text      | Page title                     |
| seo_title  | text      | SEO meta title (optional)      |
| seo_desc   | text      | SEO meta description (optional)|
| published  | boolean   | Visibility status              |
| created_at | timestamp | Creation timestamp             |
| updated_at | timestamp | Last update timestamp          |

#### `page_blocks`
Stores content blocks for dynamic page composition.

| Column     | Type    | Description                           |
|------------|---------|---------------------------------------|
| id         | integer | Primary key                           |
| page_id    | integer | Foreign key to pages                  |
| position   | integer | Display order                         |
| block_type | text    | Type: hero, richtext, gallery, form_cta|
| data       | jsonb   | Block-specific configuration          |

#### `submissions`
Stores form submissions from Contact and Security Scan forms.

| Column     | Type      | Description                              |
|------------|-----------|------------------------------------------|
| id         | integer   | Primary key                              |
| kind       | text      | Form type: 'contact' or 'security-scan'  |
| name       | text      | Submitter's name                         |
| email      | text      | Submitter's email                        |
| company    | text      | Company name (optional)                  |
| phone      | text      | Phone number (optional)                  |
| message    | text      | Message content (optional)               |
| tool_name  | text      | AI tool name (security scan only)        |
| target_url | text      | Tool URL (security scan only)            |
| created_at | timestamp | Submission timestamp                     |

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **pages**: Public read access for published pages
- **page_blocks**: Public read access for blocks of published pages
- **submissions**: Insert-only access for anonymous users, full access for authenticated users

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project dashboard.

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` (if exists)
   - Add your Supabase credentials

4. **Run database migrations**
   - Migrations are in `supabase/migrations/`
   - Apply them through Supabase Dashboard or CLI

5. **Configure edge function secrets**
   - Set `RESEND_API_KEY` in Supabase Edge Function secrets
   - Set `RECIPIENT_EMAIL` for notification destination

## Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Development Features

- Hot module replacement (HMR) for instant updates
- React Fast Refresh for component state preservation
- Source maps for debugging
- Auto-reload on file changes

## Building for Production

Create an optimized production build:

```bash
npm run build
```

This generates static files in the `dist/` directory:
- Minified and bundled JavaScript
- Optimized CSS
- Compressed assets
- Cache-busted filenames

Preview the production build locally:

```bash
npm run preview
```

## Deployment

The application can be deployed to any static hosting provider:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your repository for automatic deployments
- **GitHub Pages**: Upload `dist` contents to `gh-pages` branch
- **Traditional Web Hosting**: Upload `dist` contents via FTP/SFTP

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions, including:
- PHP-based hosting setup
- Apache `.htaccess` configuration
- Supabase CORS configuration
- SSL certificate setup
- Troubleshooting common issues

## Email Notification System

Form submissions automatically trigger email notifications:

1. **User submits form** → Data inserted into `submissions` table
2. **Database trigger fires** → Calls edge function via HTTP POST
3. **Edge function executes** → Formats email content
4. **Resend API sends email** → Notification delivered to recipient

The notification email includes:
- Submission type (Contact or Security Scan)
- Submission ID
- All form field values
- Timestamp

## Content Management

### Adding/Editing Homepage Content

Homepage content is stored in the database and can be modified through:

1. **Direct database access** via Supabase Dashboard
2. **Custom admin panel** (not included, can be built)
3. **SQL queries** for bulk updates

### Block Types

- **Hero**: Large header section with heading, subheading, description, CTA button, and background image
- **RichText**: HTML content for text-heavy sections
- **Gallery**: Image grid with titles, descriptions, and links
- **FormCTA**: Call-to-action block that links to forms

## Security

- All environment variables are kept secure in `.env` file
- Supabase API keys use Row Level Security policies
- Forms validate input on both client and database level
- CORS properly configured for API access
- Email notifications use secure API authentication

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading for optimal initial page load
- Code splitting for smaller bundle sizes
- CSS optimization and minification
- Asset compression (gzip/brotli)
- Efficient React rendering with proper key usage

## Maintenance

### Regular Tasks

1. **Monitor form submissions** in Supabase dashboard
2. **Check email delivery** through Resend dashboard
3. **Update dependencies** periodically for security patches
4. **Review error logs** in Supabase edge function logs
5. **Backup database** regularly through Supabase

### Updating Content

To update homepage content:
1. Access Supabase dashboard
2. Navigate to Table Editor
3. Edit `pages` and `page_blocks` tables
4. Changes appear immediately (no rebuild required)

### Troubleshooting

Common issues and solutions:

- **Forms not submitting**: Check Supabase credentials in `.env`
- **Emails not sending**: Verify Resend API key in edge function secrets
- **Content not loading**: Check RLS policies and database connection
- **404 on page refresh**: Ensure `.htaccess` is configured correctly

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly in development
4. Build and test production build
5. Submit pull request with clear description

## License

Proprietary - All rights reserved

## Support

For support, contact the development team or create an issue in the project repository.

## Credits

Built with modern web technologies:
- React by Meta
- Vite by Evan You
- Supabase by Supabase Inc.
- Resend by Resend Inc.
