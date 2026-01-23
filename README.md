# Model Home Art

A production-ready website for a custom framing business in Orange County, CA. Built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Prisma, and PostgreSQL.

## Features

- 🖼️ **Custom Framing** - Multi-step quote form with photo upload
- 🛒 **E-commerce** - Ready-made frames shop with Stripe checkout
- 👔 **Business Services** - B2B pricing and bulk order requests
- 🖼️ **Gallery** - Showcase of completed framing projects
- 📧 **Email Notifications** - Automated emails via Resend
- 📊 **Admin Dashboard** - Manage quotes, orders, and inquiries
- 📱 **Mobile-First** - Responsive design for all devices
- 🔍 **SEO Optimized** - Meta tags, JSON-LD, and semantic HTML

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL + Prisma ORM
- **Payments:** Stripe
- **Email:** Resend
- **File Uploads:** UploadThing
- **State Management:** Zustand

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)
- Resend account (for emails)
- UploadThing account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/model-home-art.git
   cd model-home-art
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your configuration:
   ```
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/model_home_art"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   
   # Resend (Email)
   RESEND_API_KEY="re_..."
   EMAIL_FROM="Model Home Art <noreply@yourdomain.com>"
   ADMIN_EMAIL="your-email@example.com"
   
   # UploadThing
   UPLOADTHING_SECRET="sk_..."
   UPLOADTHING_APP_ID="..."
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the site**
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## Project Structure

```
model-home-art/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data script
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── admin/         # Admin dashboard
│   │   ├── api/           # API routes
│   │   ├── business/      # Business services page
│   │   ├── contact/       # Contact page
│   │   ├── custom-framing/# Custom framing page
│   │   ├── gallery/       # Gallery page
│   │   ├── policies/      # Policy pages
│   │   ├── quote/         # Quote form
│   │   ├── shop/          # E-commerce pages
│   │   └── what-we-frame/ # Services list
│   ├── components/
│   │   ├── cart/          # Cart components
│   │   ├── home/          # Homepage sections
│   │   ├── layout/        # Header, footer, etc.
│   │   └── ui/            # shadcn/ui components
│   └── lib/
│       ├── config.ts      # Business configuration
│       ├── db.ts          # Prisma client
│       ├── store.ts       # Zustand cart store
│       └── utils.ts       # Utility functions
├── .env.example           # Environment template
├── package.json
└── README.md
```

## Configuration

### Business Information

Edit `src/lib/config.ts` to update:
- Business name and contact info
- Address and hours
- Social media links
- Shipping rates
- SEO metadata

### Adding Products

Products are stored in PostgreSQL. Add them via:
- Prisma Studio: `npm run db:studio`
- Seed script: Edit `prisma/seed.ts`
- Admin panel (coming soon)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect the repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

## API Routes

- `POST /api/quote` - Submit quote request
- `GET /api/quote` - List quotes (admin)
- `POST /api/contact` - Submit contact form
- `POST /api/business-inquiry` - Submit business inquiry

## Database Commands

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations (production)
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio
```

## Customization

### Styling

The site uses Tailwind CSS with a custom theme. Edit `src/app/globals.css` to change:
- Colors (primary, secondary, etc.)
- Typography
- Border radius
- Animations

### Components

UI components are from shadcn/ui. Add more with:
```bash
npx shadcn@latest add [component-name]
```

## License

This project is private and proprietary to Model Home Art.

## Support

For questions or issues, contact: [your-email@example.com]
