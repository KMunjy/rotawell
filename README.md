# CareOrbit - UK Care Staffing Platform

A modern, production-ready Next.js 14 (App Router) application for connecting care workers with flexible opportunities across the UK.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **UI Components**: Custom React components with Lucide icons

## Project Structure

```
careorbit-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── worker/            # Care worker dashboard
│   │   ├── provider/          # Care provider dashboard
│   │   ├── admin/             # Admin management panel
│   │   ├── login/             # Authentication pages
│   │   ├── register/
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable React components
│   │   ├── ui/               # Basic UI components
│   │   ├── layout/           # Layout components
│   │   ├── brand/            # Branding components
│   │   └── chat/             # Chat widget
│   ├── lib/                  # Utilities and helpers
│   │   ├── supabase/        # Supabase client setup
│   │   ├── types.ts         # TypeScript type definitions
│   │   └── utils.ts         # Utility functions
│   └── hooks/                # Custom React hooks
├── supabase/                 # Database migrations
│   └── migrations/
└── public/                   # Static assets
```

## Features

### For Care Workers
- Browse and apply for shifts with match scoring
- Manage active and completed bookings
- Track earnings and instant payments
- Manage compliance documents and certifications
- Complete mandatory training modules
- Professional profile management

### For Care Providers
- Post and manage care shifts
- Browse and hire verified care workers
- Review shift applications
- Manage worker bookings
- Invoice and billing dashboard
- Performance analytics

### For Administrators
- Comprehensive user management
- Escalation and dispute resolution with SLA tracking
- Platform compliance monitoring
- Content moderation
- Analytics and platform metrics

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository and navigate to the project:
```bash
cd careorbit-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

5. Set up the database:
   - Log in to Supabase
   - Run the migration from `supabase/migrations/001_initial_schema.sql`

6. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Demo Credentials

For testing purposes, use:
- **Email**: demo@careorbit.uk
- **Password**: demo123

## Database Schema

The application uses a comprehensive PostgreSQL schema including:

- **Profiles**: User information and verification status
- **Worker Profiles**: Specializations, rates, availability
- **Provider Profiles**: Organization details, contact info
- **Shifts**: Available care shifts with skills requirements
- **Applications**: Worker applications to shifts
- **Bookings**: Confirmed shift assignments
- **Earnings**: Payment tracking and history
- **Compliance Documents**: DBS, NMC, training certifications
- **Training Modules**: Mandatory and optional training courses
- **Escalations**: Issue tracking with SLA deadlines
- **Messages**: In-platform messaging system

All tables have Row Level Security (RLS) policies enabled for data protection.

## Key Components

### UI Components
- **Card**: Flexible card component with header, title, content, and footer
- **Badge**: Status and category badges with variants
- **Button**: Primary, secondary, outline, ghost, and danger variants
- **Input**: Form inputs with validation and error handling
- **MetricCard**: Dashboard metric cards with change indicators
- **DataTable**: Sortable data table with pagination

### Layout Components
- **Header**: Top navigation with user menu
- **Sidebar**: Responsive sidebar with navigation
- **MobileNav**: Mobile bottom navigation bar

### Custom Hooks
- **useUser**: Fetch current user profile
- **useShifts**: Fetch shifts with filtering options

## Authentication

Uses Supabase Auth with cookie-based session management. Protected routes are enforced via middleware in `middleware.ts`.

## Styling

- Uses Tailwind CSS with extended CareOrbit brand colors
- Custom CSS variables for theming
- Responsive design with mobile-first approach
- Custom animations (orbital rotation, pulse-scale, float)

## Development

### Building for Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with a single push to main branch

## Design System

### Color Palette
- **Primary**: #1A6B5A (Teal)
- **Accent**: #D94F5C (Coral)
- **Cream**: #FAF8F5 (Warm white)
- **Dark**: #1C1917 (Nearly black)

### Typography
- Font: Inter (Google Fonts)
- Weight: 300, 400, 500, 600, 700

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Image optimization via Next.js Image component
- Code splitting with dynamic imports
- CSS-in-JS with Tailwind for minimal bundle size
- Server-side rendering where appropriate
- Edge middleware for authentication

## Security

- Supabase Row Level Security (RLS) policies
- Environment variable protection
- CSRF protection via Next.js
- Secure authentication with JWT tokens
- Input validation on all forms

## License

Proprietary - CareOrbit Ltd

## Support

For technical support, contact the development team or refer to the CareOrbit documentation portal.
