# CareOrbit Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env.local` from the example:
```bash
cp .env.local.example .env.local
```

Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_ENVIRONMENT=development
```

### 3. Set Up the Database

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Create a new query and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Execute the query to set up all tables, types, and RLS policies

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the Application

### Demo Account
- **Email**: demo@careorbit.uk
- **Password**: demo123

This account has access to the worker dashboard. To test other roles, create additional accounts through the registration page.

## File Structure

### Core Application Files
- **`src/app/`** - All pages and layouts using Next.js App Router
- **`src/components/`** - Reusable React components organized by category
- **`src/lib/`** - TypeScript types, utilities, and Supabase client setup
- **`src/hooks/`** - Custom React hooks for data fetching
- **`middleware.ts`** - Route protection and authentication middleware
- **`supabase/migrations/`** - Database schema and migrations

### Configuration Files
- **`package.json`** - Dependencies and scripts
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.js`** - Tailwind CSS extensions
- **`next.config.js`** - Next.js configuration
- **`postcss.config.js`** - PostCSS configuration

### Styling
- **`src/app/globals.css`** - Global styles and CSS custom properties

## Dashboard Access

### Worker Dashboard
- URL: `/worker/*`
- Features: Shifts, Bookings, Earnings, Compliance, Training, Profile

### Provider Dashboard
- URL: `/provider/*`
- Features: Post Shifts, Find Workers, Applications, Bookings, Invoices, Analytics

### Admin Dashboard
- URL: `/admin/*`
- Features: User Management, Escalations, Compliance, Disputes, Moderation, Analytics

## Key Components

### UI Components (in `src/components/ui/`)
- **Card**: Flexible card layout component
- **Badge**: Status and category badges
- **Button**: Primary, secondary, outline variants
- **Input**: Form input with validation
- **MetricCard**: Dashboard metrics display
- **DataTable**: Sortable data table

### Layout Components (in `src/components/layout/`)
- **Header**: Top navigation bar
- **Sidebar**: Main navigation sidebar
- **MobileNav**: Mobile bottom navigation

### Custom Hooks (in `src/hooks/`)
- **useUser()** - Fetch current user profile
- **useShifts()** - Fetch shifts with filtering

## Database Tables

### Authentication & Profiles
- `profiles` - User accounts (extends auth.users)
- `worker_profiles` - Worker-specific data
- `provider_profiles` - Provider-specific data

### Core Business Logic
- `shifts` - Available care shifts
- `applications` - Applications to shifts
- `bookings` - Confirmed shift assignments
- `earnings` - Payment tracking

### Compliance & Training
- `compliance_documents` - DBS, NMC, certifications
- `training_modules` - Training courses
- `worker_training` - Training progress

### Operations & Support
- `escalations` - Issues with SLA tracking
- `messages` - In-platform messaging

## Environment Setup for Production

When deploying to production:

1. Update `.env.local` with production Supabase credentials
2. Set `NEXT_PUBLIC_ENVIRONMENT=production`
3. Ensure all RLS policies are properly configured
4. Set up CORS rules in Supabase
5. Configure custom domain

## Common Tasks

### Adding a New Page
1. Create folder in `src/app/[section]/[page]/`
2. Add `page.tsx` file
3. Page will be automatically routed

### Creating a New Component
1. Add to `src/components/[category]/`
2. Use TypeScript for type safety
3. Import and use in pages

### Adding a New Hook
1. Create file in `src/hooks/use-[name].ts`
2. Export the hook function
3. Import in pages/components as needed

### Querying the Database
1. Use Supabase client from `src/lib/supabase/client.ts` (browser)
2. Use Supabase client from `src/lib/supabase/server.ts` (server components)
3. Follow RLS policies for security

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Supabase Connection Issues
- Verify credentials in `.env.local`
- Check network connectivity
- Ensure Supabase project is active

### TypeScript Errors
- Run `npm run lint` to check
- Ensure all types are imported from `src/lib/types.ts`

### Styling Issues
- Rebuild Tailwind: `npm run dev`
- Check `tailwind.config.js` for custom configurations

## Next Steps

1. **Seed Demo Data**: Run migrations first, then add sample data
2. **Customize Branding**: Update colors in `tailwind.config.js` and `globals.css`
3. **Add Payment Integration**: Integrate Stripe/PayPal in earnings flow
4. **Deploy to Vercel**: Connect GitHub repo and deploy

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Support

For technical support or questions about the CareOrbit codebase, refer to the main README.md or contact the development team.
