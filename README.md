# Oolvay

**The Next.js SaaS starter kit built for the modern stack and the Indian market.**

Oolvay is a production-ready, batteries-included SaaS starter kit built on Next.js 16. It ships everything a founding engineer needs to go from zero to paying customers: authentication, payments, email, analytics, security, storage, a blog, an admin dashboard, and a CI/CD pipeline, all wired together, tested, and ready to customise.

Unlike other starter kits that use yesterday's tools, Oolvay is built on the latest versions of everything: Next.js 16 with Turbopack, Tailwind CSS v4, Better Auth, Drizzle ORM, and Zod v4. It is the only major SaaS starter kit with first-class Razorpay support, making it the natural choice for founders building for Indian users.

---

## Table of Contents

1. [Feature Overview](#1-feature-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Prerequisites](#4-prerequisites)
5. [Quick Start - Local Development](#5-quick-start--local-development)
6. [Third-Party Service Setup](#6-third-party-service-setup)
   - [Neon (Database)](#61-neon-database)
   - [Upstash Redis](#62-upstash-redis)
   - [Better Auth - Google OAuth](#63-better-auth--google-oauth)
   - [Resend (Email)](#64-resend-email)
   - [AWS - S3 + CloudFront via CDK](#65-aws--s3--cloudfront-via-cdk)
   - [Arcjet (Rate Limiting and Bot Protection)](#66-arcjet-rate-limiting-and-bot-protection)
   - [Sentry (Error Monitoring)](#67-sentry-error-monitoring)
   - [PostHog (Analytics)](#68-posthog-analytics)
   - [LemonSqueezy (Payments)](#69-lemonsqueezy-payments)
   - [Razorpay (Payments)](#610-razorpay-payments)
   - [Vercel (Deployment)](#611-vercel-deployment)
7. [Environment Variables Reference](#7-environment-variables-reference)
8. [Database Setup and Migrations](#8-database-setup-and-migrations)
9. [Payments - Configuration Guide](#9-payments--configuration-guide)
10. [Authentication - Configuration Guide](#10-authentication--configuration-guide)
11. [Email Templates](#11-email-templates)
12. [Tier and Access Control](#12-tier-and-access-control)
13. [Blog - MDX and Rich Text System](#13-blog--mdx-and-rich-text-system)
14. [Admin Dashboard](#14-admin-dashboard)
15. [CI/CD Pipeline](#15-cicd-pipeline)
16. [Customisation Checklist](#16-customisation-checklist)
17. [Troubleshooting](#17-troubleshooting)
18. [Licence](#18-licence)

---

## 1. Feature Overview

### Authentication

- Google OAuth (one-click sign-in)
- Magic link (passwordless email sign-in)
- Passkeys (WebAuthn - biometric and device authentication)
- API key authentication via the `@better-auth/api-key` plugin
- Protected and public route middleware
- Session watcher with idle detection and automatic logout
- "Log out everywhere" - invalidates all active sessions globally
- `logOutEverywhereInstantly` toggle - optional immediate session invalidation
- Redis-backed session caching via Upstash for fast repeated lookups

### Payments

- **LemonSqueezy** - merchant-of-record, automatic VAT/GST, global cards
- **Razorpay** - UPI, NetBanking, Indian debit/credit cards, wallets
- Subscriptions (monthly and yearly) and one-time payments
- Three-tier access control: Starter (free), Pro, Business
- Hosted checkout (LemonSqueezy) and modal checkout (Razorpay)
- Billing portal (LemonSqueezy) and manually-built billing management (Razorpay)
- Webhook pipeline with idempotency - duplicate webhooks are silently ignored
- Subscription state machine: trialing, active, past_due, canceled, paused
- Failed-webhook reconciliation cron
- Lifetime plan support

### Email

- Transactional email via Resend
- React Email templating - type-safe, component-based HTML emails
- Magic link welcome email
- Contact form confirmation email

### Storage

- AWS S3 avatar uploads
- Pre-signed URLs - the browser uploads directly to S3, never through your server
- IAM roles provisioned via AWS CDK - no long-lived access keys stored anywhere
- CloudFront CDN in front of S3 - fast global delivery of uploaded assets

### Developer Experience and Infrastructure

- Bun as the package manager and runtime - faster installs, faster scripts
- Turbopack for local development - near-instant HMR
- TypeScript 5 in strict mode throughout - no `any`, no shortcuts
- Environment variable validation via `@t3-oss/env-nextjs` + Zod - crashes at startup if variables are missing, never at runtime
- `gen:env` script - auto-generates `.env.example` directly from `env.ts` so the template never goes stale
- Drizzle ORM - type-safe SQL, zero magic, readable query builder
- Neon serverless PostgreSQL - HTTP driver works in Edge and serverless contexts
- GitHub Actions CI/CD pipeline: lint, type-check, build, and deploy on push
- Prettier for consistent code formatting across the entire codebase
- `preflight` script - runs audit, lint, type-check, and format check in one command before pushing

### Security

- Arcjet rate limiting on all auth routes and the contact form
- Arcjet bot detection on the auth catch-all
- Content Security Policy (CSP) headers
- GDPR/CCPA cookie consent banner - PostHog is not loaded until consent is given
- Webhook signature verification on all payment providers

### Analytics and Monitoring

- PostHog - product analytics and user identification, consent-gated
- Sentry 10 - error monitoring and session replay
- Health check endpoint at `/api/admin/health` for uptime monitors

### Content

- MDX-based blog - write posts as `.mdx` files, rendered with full React support
- Tiptap rich text editor for the admin write interface - no raw MDX required
- Admin-only blog write and edit interface
- Drafts view for unpublished posts
- Blog SEO: OG tags, metadata, canonical URLs per post
- Blog categories

### UI and UX

- shadcn/ui component library built on Radix primitives
- Tailwind CSS v4 with a design token system
- Light, dark, and system theme support
- React Hot Toast for non-intrusive notifications
- React Hook Form with Zod validation - no uncontrolled forms
- Contact page with form and animated success screen
- lucide-react and react-icons icon sets
- date-fns for date formatting utilities
- react-day-picker for calendar and date picker components

### SEO and Discoverability

- OG tags and Twitter cards on all pages
- Canonical URL management
- `robots.txt` and `sitemap.xml`
- Google Search Console verification meta tag
- Microsoft Bing verification meta tag
- Structured data / JSON-LD schema

### Pages (Scaffolded and Ready to Customise)

- Homepage, About, Features, Pricing, Blog
- Dashboard with meaningful content
- Security page - active sessions list, revoke individual sessions
- Admin dashboard - user management, analytics, roles

### Roles and Permissions

- User roles system: `user` and `admin` out of the box
- Role-based access control on API routes and UI

---

## 2. Tech Stack

| Concern                        | Technology                      | Version          |
| ------------------------------ | ------------------------------- | ---------------- |
| Framework                      | Next.js (App Router)            | 16.2.6           |
| Language                       | TypeScript (strict)             | 5.x              |
| Package Manager                | Bun                             | Latest           |
| Styling                        | Tailwind CSS                    | v4               |
| Component Library              | shadcn/ui + Radix UI            | Latest           |
| Icons                          | lucide-react + react-icons      | ^1.14.0 / ^5.6.0 |
| Rich Text Editor               | Tiptap                          | ^3.23.x          |
| Database                       | Neon (serverless PostgreSQL)    | -                |
| Database Driver                | @neondatabase/serverless        | ^1.1.0           |
| ORM                            | Drizzle ORM                     | ^0.45.2          |
| Migrations                     | drizzle-kit                     | ^0.31.x          |
| Authentication                 | Better Auth                     | ^1.6.10          |
| Auth Plugins                   | passkey, api-key                | ^1.6.10          |
| Session Caching                | Upstash Redis                   | ^1.38.0          |
| Validation                     | Zod                             | ^4.4.3           |
| Forms                          | React Hook Form                 | ^7.75.0          |
| Email Sending                  | Resend                          | ^6.12.3          |
| Email Templates                | React Email                     | ^5.2.11          |
| File Storage                   | AWS S3 (via @aws-sdk/client-s3) | ^3.x             |
| CDN                            | AWS CloudFront                  | -                |
| Infrastructure as Code         | AWS CDK                         | v2               |
| Rate Limiting / Bot Protection | Arcjet                          | ^1.4.0           |
| Error Monitoring               | Sentry                          | ^10.52.0         |
| Analytics                      | PostHog                         | ^1.372.x         |
| Payments (global)              | LemonSqueezy                    | ^4.0.0           |
| Payments (India)               | Razorpay                        | ^2.9.6           |
| Notifications                  | React Hot Toast                 | ^2.6.0           |
| Date Utilities                 | date-fns                        | ^4.1.0           |
| Env Validation                 | @t3-oss/env-nextjs              | ^0.13.x          |
| Formatting                     | Prettier                        | ^3.8.x           |
| CI/CD                          | GitHub Actions                  | -                |
| Hosting                        | Vercel                          | -                |

> **Note on Stripe:** The `stripe` package is installed as a dependency for future flexibility, but it is not the active payment provider. The active provider is controlled by the `PAYMENT_PROVIDER` environment variable and is set to either `lemonsqueezy` or `razorpay`.

---

## 3. Project Structure

```
oolvay/
├── app/
│   ├── (auth)/                  # Sign-in, sign-up, magic link pages
│   ├── (marketing)/             # Homepage, about, features, pricing, blog
│   ├── (dashboard)/             # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── security/            # Session management
│   │   └── billing/             # Billing management (Razorpay)
│   ├── (admin)/                 # Admin-only pages
│   │   └── admin/
│   └── api/
│       ├── auth/[...all]/       # Better Auth catch-all handler
│       ├── admin/health/        # Health check endpoint
│       ├── contact/             # Contact form handler
│       └── payments/
│           ├── checkout/        # Initiate checkout
│           ├── checkout/verify/ # Razorpay HMAC verification
│           ├── subscription/    # Subscription status
│           ├── subscription/cancel/
│           ├── subscription/resume/
│           ├── billing-portal/  # LemonSqueezy portal
│           ├── webhooks/
│           │   ├── lemonsqueezy/
│           │   └── razorpay/
│           └── cron/
│               └── reconcile-webhooks/
├── components/
│   ├── ui/                      # shadcn/ui base components
│   ├── payments/                # CheckoutButton, PricingTable, etc.
│   ├── blog/                    # Blog post renderer, card, list
│   ├── auth/                    # Sign-in forms, session components
│   └── shared/                  # Navbar, footer, theme toggle, etc.
├── config/
│   └── tiers.ts                 # Edit this to configure your plans
├── db/
│   ├── drizzle.ts               # Drizzle client
│   └── schema/
│       ├── auth.ts              # Users table (Better Auth managed)
│       └── payments.ts          # Subscriptions, orders, webhook_events
├── emails/                      # React Email templates
├── lib/
│   ├── auth/
│   │   └── get-server-session.ts
│   ├── arcjet.ts                # Shared Arcjet instance
│   ├── redis.ts                 # Upstash Redis client
│   ├── s3.ts                    # S3 pre-signed URL helpers
│   └── payments/
│       ├── index.ts             # Active provider singleton
│       ├── types.ts             # All shared payment interfaces
│       ├── price-map.ts         # Internal ID to provider ID mapping
│       ├── subscription-state.ts
│       ├── client.ts            # Typed fetch helpers for client components
│       ├── adapters/
│       │   ├── lemonsqueezy.ts
│       │   └── razorpay.ts
│       └── handlers/            # Webhook event handlers
├── content/
│   └── blog/                    # MDX blog posts
├── scripts/
│   ├── reset-db.ts              # Database reset script (dev only)
│   ├── seed-blog.ts             # Blog seed data
│   └── generate-env-example.ts  # Generates .env.example from env.ts
├── cdk/                         # AWS CDK infrastructure code
├── public/
├── env.ts                       # Environment variable validation
├── middleware.ts                 # Route protection middleware
├── next.config.ts
├── drizzle.config.ts
└── .github/
    └── workflows/               # GitHub Actions CI/CD
```

---

## 4. Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Bun** - `curl -fsSL https://bun.sh/install | bash` (v1.1 or later)
- **Node.js** - v20 or later (required by some CDK tooling)
- **Git**
- **AWS CLI** - `brew install awscli` or [download here](https://aws.amazon.com/cli/) - needed for CDK deployment
- **AWS CDK CLI** - `bun add -g aws-cdk`

You will also need accounts at the following services. All have free tiers sufficient for development:

- [Neon](https://neon.tech) - PostgreSQL database
- [Upstash](https://upstash.com) - Redis
- [Google Cloud Console](https://console.cloud.google.com) - for Google OAuth credentials
- [Resend](https://resend.com) - transactional email
- [AWS](https://aws.amazon.com) - S3, CloudFront, CDK
- [Arcjet](https://arcjet.com) - rate limiting and bot protection
- [Sentry](https://sentry.io) - error monitoring
- [PostHog](https://posthog.com) - product analytics
- [LemonSqueezy](https://lemonsqueezy.com) - payments (global)
- [Razorpay](https://razorpay.com) - payments (India)
- [Vercel](https://vercel.com) - deployment

---

## 5. Quick Start - Local Development

```bash
# 1. Clone the repository
git clone https://github.com/Oolvay/oolvay.git my-saas
cd my-saas

# 2. Install dependencies
bun install

# 3. Generate the .env.example file from env.ts, then copy it
bun gen:env
cp .env.example .env.local

# 4. Fill in your environment variables
# Follow Section 6 of this README for each service.
# At minimum for local dev you need: DATABASE_URL, BETTER_AUTH_SECRET,
# and NEXT_PUBLIC_APP_URL.

# 5. Run database migrations
bun db:generate
bun db:migrate

# 6. (Optional) Seed the blog with sample content
bun db:seed

# 7. Start the development server (Turbopack)
bun dev
```

The app will be running at `http://localhost:3000`.

### Useful development commands

```bash
bun db:studio      # Open Drizzle Studio (visual DB browser) at https://local.drizzle.studio
bun format         # Format all files with Prettier
bun format:check   # Check formatting without writing changes
bun type-check     # Run the TypeScript compiler in check mode
bun preflight      # Run audit, lint, type-check, and format check in sequence
bun clean          # Remove .next and node_modules for a clean slate
```

> **Before pushing or opening a pull request**, run `bun preflight`. It runs `bun audit`, `bun lint`, `bun type-check`, and `bun format:check` in sequence and will catch any issues before CI does.

---

## 6. Third-Party Service Setup

Work through each section below and copy the resulting keys into your `.env.local`.

---

### 6.1 Neon (Database)

Neon is a serverless PostgreSQL provider. Your database is free for development and scales automatically in production.

1. Go to [neon.tech](https://neon.tech) and create an account.
2. Click **"New Project"**. Give it the same name as your app.
3. Select a region closest to your users. For India, use **AWS ap-south-1 (Mumbai)**.
4. Once created, open the **Connection Details** panel.
5. Select **"Pooled connection"** from the dropdown (important for serverless).
6. Copy the connection string - it looks like: `postgresql://user:password@ep-xxx.ap-south-1.aws.neon.tech/neondb?sslmode=require`

```bash
# .env.local
DATABASE_URL=postgresql://user:password@ep-xxx.ap-south-1.aws.neon.tech/neondb?sslmode=require
```

> **Tip:** Neon supports database branching. Create a `dev` branch in the Neon dashboard and use its connection string for local development. This keeps your production database clean.

---

### 6.2 Upstash Redis

Upstash provides serverless Redis with per-request billing. It is used for session caching - requests that read the session skip the database on cache hits.

1. Go to [upstash.com](https://upstash.com) and create an account.
2. Click **"Create Database"**.
3. Choose **"Regional"** and select the same region as your Neon database.
4. Enable **"Eviction"** so the cache self-manages under memory pressure.
5. Once created, click the database name to open its detail page.
6. Scroll to **"REST API"** and copy:
   - **UPSTASH_REDIS_REST_URL** - the HTTPS endpoint
   - **UPSTASH_REDIS_REST_TOKEN** - the token

```bash
# .env.local
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...
```

> **Note:** Redis is optional. If these variables are absent, the app falls back to database session lookups on every request. It is strongly recommended to configure this before going to production.

---

### 6.3 Better Auth - Google OAuth

Better Auth handles all authentication logic. No third-party auth service account is required - it runs in your own infrastructure. You do need to configure OAuth providers separately.

#### Generate the Better Auth secret

```bash
# Run this in your terminal to generate a secure secret
openssl rand -base64 32
```

```bash
# .env.local
BETTER_AUTH_SECRET=your-generated-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000   # Change to your production URL on Vercel
```

#### Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Create a new project (or select an existing one).
3. In the left sidebar, navigate to **APIs and Services → Credentials**.
4. Click **"Create Credentials" → "OAuth client ID"**.
5. Choose **"Web application"**.
6. Under **"Authorised redirect URIs"**, add:
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Click **"Create"** and copy the **Client ID** and **Client Secret**.

```bash
# .env.local
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
```

> **Note on Passkeys:** Passkeys (WebAuthn) work out of the box without any configuration. They use your app's own domain as the Relying Party identifier. No third-party keys are required.

> **Note on API Keys:** The `@better-auth/api-key` plugin is pre-installed and enables programmatic access for your users via API keys. No additional configuration is required to enable it.

---

### 6.4 Resend (Email)

Resend handles all outgoing transactional email.

1. Go to [resend.com](https://resend.com) and create an account.
2. In the sidebar, click **"API Keys" → "Create API Key"**.
3. Give it a name (e.g., `oolvay-dev`) and set permission to **"Sending access"**.
4. Copy the key - it starts with `re_`.
5. Click **"Domains"** and add your sending domain (e.g., `mail.yourdomain.com`).
6. Follow the DNS verification steps Resend provides. This typically involves adding three DNS records (SPF, DKIM, DMARC) to your domain registrar.

> **For local development:** You can skip domain verification and use Resend's testing address `onboarding@resend.dev` as your sender. Emails will only be delivered to the email address associated with your Resend account.

```bash
# .env.local
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=hello@yourdomain.com   # Must be on a verified domain for production
```

---

### 6.5 AWS - S3 + CloudFront via CDK

Oolvay uses AWS CDK to provision all infrastructure as code. You do not manually click through the AWS console - you run a single deploy command and CDK creates everything: the S3 bucket, the IAM role for uploads, the CloudFront distribution, and the bucket policy.

#### Step 1 - Configure the AWS CLI

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: ap-south-1 (Mumbai) for India, or your preferred region
# Default output format: json
```

> Get your AWS Access Key from **IAM → Users → your user → Security credentials → Create access key**. Choose "Local code" as the use case.

#### Step 2 - Bootstrap CDK (one-time per AWS account and region)

CDK bootstrapping provisions a small set of resources in your AWS account that CDK needs to operate. This is a one-time operation per account/region combination.

```bash
cd cdk
bun install
cdk bootstrap aws://YOUR_ACCOUNT_ID/ap-south-1
```

Find your Account ID in the top-right corner of the AWS console, or run `aws sts get-caller-identity`.

#### Step 3 - Deploy the CDK stack

```bash
cdk deploy
```

CDK will show you what it is about to create and ask for confirmation. Type `y` to proceed.

After deployment, CDK outputs:

- **S3BucketName** - copy this
- **CloudFrontDomain** - copy this (e.g., `dxxxxxxxxxxxxx.cloudfront.net`)

```bash
# .env.local
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_CLOUDFRONT_DOMAIN=dxxxxxxxxxxxxx.cloudfront.net
AWS_REGION=ap-south-1
```

> **Security note:** The CDK stack creates an IAM role with a scoped policy - it only grants `s3:PutObject` on the specific bucket. No long-lived AWS access keys are stored in your app or environment variables for upload operations. Pre-signed URLs are generated server-side using the IAM role.

#### Subsequent updates

Any time you change the CDK stack definition (in `cdk/lib/`):

```bash
cdk diff    # Preview changes
cdk deploy  # Apply changes
```

---

### 6.6 Arcjet (Rate Limiting and Bot Protection)

Arcjet protects your auth routes and contact form from abuse, brute-force attacks, and bots.

1. Go to [arcjet.com](https://arcjet.com) and create an account.
2. Click **"New application"** and give it your app's name.
3. Copy the **API key** from the dashboard.

```bash
# .env.local
ARCJET_KEY=ajkey_xxx
```

Arcjet is already wired into:

- `app/api/auth/[...all]/route.ts` - bot detection + rate limiting on POST
- `app/api/admin/health/route.ts` - sliding window rate limit
- `app/api/contact/route.ts` - rate limiting

> **If `ARCJET_KEY` is absent**, all Arcjet guards silently no-op. The app remains functional but unprotected. This is fine for local development but must be set before going to production.

---

### 6.7 Sentry (Error Monitoring)

Sentry captures exceptions and records session replays so you can debug production issues.

1. Go to [sentry.io](https://sentry.io) and create an account.
2. Click **"Create Project"** and choose **"Next.js"**.
3. Follow the setup wizard. When asked, select **"Connect to GitHub"** to link your repository for commit tracking.
4. Copy the **DSN** from **Settings → Projects → your project → Client Keys (DSN)**.

```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxx@oyyy.ingest.sentry.io/zzz
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=sntrys_xxx   # From Settings → Auth Tokens → Create New Token
```

The `SENTRY_AUTH_TOKEN` is used by the Next.js Sentry plugin at build time to upload source maps, which makes stack traces in Sentry point to your original TypeScript rather than compiled JavaScript.

> **Session Replay:** Already enabled. Replays are captured for 10% of sessions and 100% of sessions where an error occurs. Adjust these rates in `sentry.client.config.ts`.

---

### 6.8 PostHog (Analytics)

PostHog tracks user behaviour and product events. It only initialises after the user accepts the cookie consent banner (GDPR/CCPA compliant by default).

1. Go to [posthog.com](https://posthog.com) and create an account.
2. Create a new project. Choose **"Cloud (EU)"** if your users are primarily in Europe, or **"Cloud (US)"** otherwise.
3. Copy the **Project API Key** from **Settings → Project → Project API Key** - it starts with `phc_`.
4. Copy the **API Host**: `https://app.posthog.com` for US, `https://eu.posthog.com` for EU.

```bash
# .env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

User identification is already wired in. When a user signs in, their PostHog anonymous profile is merged with their `userId` and `email`.

---

### 6.9 LemonSqueezy (Payments)

LemonSqueezy acts as the merchant of record, handling VAT, GST, and sales tax automatically. It is the recommended payment provider for global products.

#### Step 1 - Create your store

1. Go to [lemonsqueezy.com](https://lemonsqueezy.com) and create an account.
2. Complete your store setup - you will need to provide business details and a payout method.
3. From the sidebar, click **"Settings" → "API"** and create a new API key. Copy it.
4. Copy your **Store ID** from **Settings → Stores**.

```bash
# .env.local
LEMONSQUEEZY_API_KEY=eyJ0...
LEMONSQUEEZY_STORE_ID=12345
```

#### Step 2 - Create products and variants

For each plan in `config/tiers.ts`, you need a product and a variant in LemonSqueezy:

1. Click **"Products" → "New Product"**.
2. Create **"Pro - Monthly"** as a subscription at your chosen price per month.
3. After saving, open the product and click the variant. Copy the **Variant ID** (a number, e.g., `98765`).
4. Repeat for Pro - Yearly, Business - Monthly, Business - Yearly, and Lifetime (one-time).

Paste these Variant IDs into `lib/payments/price-map.ts`:

```ts
pro_monthly: {
  lemonsqueezy: "98765",   // your variant ID here
  ...
}
```

#### Step 3 - Configure the webhook

1. Go to **Settings → Webhooks → New Webhook**.
2. Set the URL to `https://yourdomain.com/api/payments/webhooks/lemonsqueezy`.
3. Copy the **Signing Secret** that LemonSqueezy generates.
4. Enable these events:
   - `order_created`
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_expired`
   - `subscription_payment_success`
   - `subscription_payment_failed`
   - `subscription_payment_recovered`

```bash
# .env.local
LEMONSQUEEZY_WEBHOOK_SECRET=xxx
PAYMENT_PROVIDER=lemonsqueezy
```

> **Test mode:** LemonSqueezy has a test mode toggle in the top bar. Create all products and webhooks in test mode first. Switch to live mode only before your production launch.

---

### 6.10 Razorpay (Payments)

Razorpay is the payment provider for Indian users: UPI, NetBanking, and Indian debit/credit cards.

#### Step 1 - Create your account

1. Go to [razorpay.com](https://razorpay.com) and create an account.
2. Complete KYC verification (required to accept live payments).
3. In the dashboard, navigate to **Settings → API Keys → Generate Test Key**.
4. Copy the **Key ID** (starts with `rzp_test_`) and the **Key Secret**.

```bash
# .env.local
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx   # Same value, exposed to the browser
```

#### Step 2 - Create plans (for subscriptions)

Razorpay requires you to create plans for recurring subscriptions:

1. Go to **Subscriptions → Plans → Create Plan**.
2. Create a plan for each subscription tier (Pro Monthly, Pro Yearly, etc.).
3. Copy the **Plan ID** (starts with `plan_`) for each.
4. Paste into `lib/payments/price-map.ts`.

#### Step 3 - Configure the webhook

1. Go to **Settings → Webhooks → Add New Webhook**.
2. Set the URL to `https://yourdomain.com/api/payments/webhooks/razorpay`.
3. Set a **Secret** (generate one with `openssl rand -hex 32`).
4. Enable these events:
   - `payment.captured`
   - `payment.failed`
   - `subscription.activated`
   - `subscription.updated`
   - `subscription.cancelled`
   - `subscription.completed`
   - `subscription.charged`
   - `refund.created`

```bash
# .env.local
RAZORPAY_WEBHOOK_SECRET=xxx
PAYMENT_PROVIDER=razorpay   # Set this to switch the active provider
```

> **Note on the Razorpay checkout modal:** Unlike LemonSqueezy, which redirects to a hosted page, Razorpay opens a JavaScript modal on your own domain. The `<CheckoutButton>` component handles both flows automatically - no extra configuration is needed.

> **Switching providers:** To switch between LemonSqueezy and Razorpay, change only the `PAYMENT_PROVIDER` environment variable. All other payment logic selects the right adapter automatically.

---

### 6.11 Vercel (Deployment)

#### Step 1 - Deploy

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"New Project"**.
3. Import your GitHub repository.
4. Vercel will auto-detect Next.js. Do not change the framework settings.
5. Click **"Deploy"**. The first deploy will likely fail - that is expected, because you have not added environment variables yet.

#### Step 2 - Add environment variables

1. Go to your project on Vercel → **Settings → Environment Variables**.
2. Add every variable from your `.env.local`. For production, use your live API keys, not test keys.
3. Make sure `NEXT_PUBLIC_APP_URL` is set to your production domain (e.g., `https://yoursaas.com`).

#### Step 3 - Redeploy

After adding all environment variables, go to **Deployments → the failed deployment → Redeploy**.

#### Step 4 - Custom domain

1. Go to **Settings → Domains**.
2. Add your domain and follow the DNS configuration instructions Vercel provides.
3. Vercel provisions a free TLS certificate automatically via Let's Encrypt.

#### Step 5 - Update OAuth and webhook URLs

After your domain is live, return to each service and update any `localhost` URLs to your production domain:

- Google Cloud Console → OAuth redirect URIs
- LemonSqueezy → Webhook URL
- Razorpay → Webhook URL

#### Cron jobs (Vercel plan limits)

The failed-webhook reconciliation cron is defined in `vercel.json`. Its schedule depends on your Vercel plan:

> [!NOTE]
> Vercel Hobby plans only allow cron jobs to run once per day.
> During local development or on a Hobby deployment, use:
>
> ```json
> "schedule": "0 0 * * *"
> ```
>
> On Vercel Pro or higher, change this to once per hour:
>
> ```json
> "schedule": "0 * * * *"
> ```

The cron re-processes any `webhook_events` rows with `status = 'failed'` from the past 24 hours. If you are on a Hobby plan and a webhook fails, it will not be retried until midnight. For a production product handling real payments, Vercel Pro is strongly recommended.

The cron route is protected by a `CRON_SECRET` header. Add this to Vercel as well:

```bash
CRON_SECRET=your-random-secret   # Generate with: openssl rand -hex 32
```

---

## 7. Environment Variables Reference

Run `bun gen:env` to auto-generate a fresh `.env.example` from `env.ts`, then copy it:

```bash
bun gen:env
cp .env.example .env.local
```

Full reference:

```bash
# ── App ───────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Database ──────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@ep-xxx.ap-south-1.aws.neon.tech/neondb?sslmode=require

# ── Redis ─────────────────────────────────────────────────────────────────────
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# ── Auth ──────────────────────────────────────────────────────────────────────
BETTER_AUTH_SECRET=your-generated-secret
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# ── Email ─────────────────────────────────────────────────────────────────────
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=hello@yourdomain.com

# ── AWS ───────────────────────────────────────────────────────────────────────
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_CLOUDFRONT_DOMAIN=dxxxxxxxxxxxxx.cloudfront.net
AWS_REGION=ap-south-1

# ── Arcjet ────────────────────────────────────────────────────────────────────
ARCJET_KEY=ajkey_xxx

# ── Sentry ────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SENTRY_DSN=https://xxx@oyyy.ingest.sentry.io/zzz
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=sntrys_xxx

# ── PostHog ───────────────────────────────────────────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ── Payments ──────────────────────────────────────────────────────────────────
PAYMENT_PROVIDER=lemonsqueezy   # lemonsqueezy | razorpay

# LemonSqueezy
LEMONSQUEEZY_API_KEY=eyJ0...
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=xxx

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx

# ── Cron ──────────────────────────────────────────────────────────────────────
CRON_SECRET=your-random-secret
```

---

## 8. Database Setup and Migrations

All database schema lives in `db/schema/`. Drizzle ORM handles all migrations.

### Available commands

```bash
bun db:generate   # Generate SQL migration files from schema changes
bun db:migrate    # Apply pending migrations to the database
bun db:push       # Push schema directly to DB (dev only - skips migration files)
bun db:studio     # Open Drizzle Studio at https://local.drizzle.studio
bun db:drop       # Drop a specific migration
bun db:reset      # Reset the entire database (DESTRUCTIVE - dev only)
bun db:seed       # Seed the blog with sample content
```

### Workflow for schema changes

1. Edit the schema in `db/schema/*.ts`.
2. Run `bun db:generate` - this creates a new SQL file in `drizzle/` (do not edit these manually).
3. Run `bun db:migrate` - this applies the migration to your database.
4. Commit both the schema change and the generated migration file.

> **Do not run `bun db:push` in production.** It bypasses the migration system and can cause data loss. Always use `bun db:generate` + `bun db:migrate`.

> **Do not run `bun db:reset` in production.** It drops and recreates all tables. It is intended for local development only when you want a clean slate.

### Initial setup

After cloning and configuring `DATABASE_URL`, run:

```bash
bun db:generate
bun db:migrate
bun db:seed   # Optional - populates sample blog posts
```

This creates all tables: users, sessions, accounts (Better Auth), subscriptions, orders, and webhook_events.

---

## 9. Payments - Configuration Guide

### Choosing a provider

Set `PAYMENT_PROVIDER` in your environment:

| Value          | Best for                                                                      |
| -------------- | ----------------------------------------------------------------------------- |
| `lemonsqueezy` | Global products, automatic VAT/GST, solo founders who want merchant-of-record |
| `razorpay`     | Indian users - UPI, NetBanking, local cards                                   |

You can only have one active provider at a time. The entire payment system adapts automatically.

### Configuring your plans

Open `config/tiers.ts`. This is the single file you edit to define your pricing:

```ts
export const TIERS: Record<TierKey, TierConfig> = {
  starter: {
    name: "Starter",
    priceId: null,          // null = free, no checkout required
    limits: { seats: 1, projects: 3, storageGb: 1, apiCallsPerMonth: 1000 },
    features: ["Up to 3 projects", "1 GB storage", ...],
    highlighted: false,
  },
  pro: {
    name: "Pro",
    priceId: "pro_monthly", // matches a key in lib/payments/price-map.ts
    ...
  },
  ...
}
```

### Mapping provider IDs

Open `lib/payments/price-map.ts`. For each plan, enter the corresponding ID from your provider dashboard:

```ts
export const PRICE_MAP = {
  pro_monthly: {
    lemonsqueezy: "98765",    // LemonSqueezy Variant ID
    razorpay: "plan_xxx",     // Razorpay Plan ID
  },
  ...
}
```

### Testing webhooks locally

Use [ngrok](https://ngrok.com) to expose your local server:

```bash
ngrok http 3000
# Copy the HTTPS URL (e.g., https://xxxx.ngrok.io)
# Set it as the webhook URL in your provider dashboard + /api/payments/webhooks/[provider]
```

> Remember to update the webhook URL in the provider dashboard each time your ngrok URL changes. Use a paid ngrok plan for a stable subdomain.

### Reconciliation cron - Vercel plan limits

The failed-webhook reconciliation cron is defined in `vercel.json`. Its schedule depends on your Vercel plan:

> [!NOTE]
> Vercel Hobby plans only allow cron jobs to run once per day.
> During local development or on a Hobby deployment, use:
>
> ```json
> "schedule": "0 0 * * *"
> ```
>
> On Vercel Pro or higher, change this to once per hour:
>
> ```json
> "schedule": "0 * * * *"
> ```

The cron re-processes any `webhook_events` rows with `status = 'failed'` from the past 24 hours. If you are on a Hobby plan and a webhook fails, it will not be retried until midnight. For a production product handling real payments, Vercel Pro is strongly recommended.

---

## 10. Authentication - Configuration Guide

### Sign-in methods

All methods are enabled by default:

| Method       | What the user does                                                             |
| ------------ | ------------------------------------------------------------------------------ |
| Google OAuth | Clicks "Continue with Google", completes Google's consent screen               |
| Magic Link   | Enters email, receives a sign-in link, clicks it                               |
| Passkey      | Uses Face ID, Touch ID, or Windows Hello on a registered device                |
| API Key      | Generates a key from account settings, passes it in the `Authorization` header |

### Protecting routes

Route protection is handled in `middleware.ts`. Public routes (marketing pages, blog) are defined in the `publicRoutes` array. Everything else requires a session.

To add a new public route:

```ts
// middleware.ts
const publicRoutes = [
  "/",
  "/about",
  "/features",
  "/pricing",
  "/blog",
  "/blog/(.*)",
  "/contact",
  "/your-new-public-route", // add here
]
```

### Protecting API routes

Every protected API route follows this pattern:

```ts
import { getServerSession } from "@/lib/auth/get-server-session"

const session = await getServerSession()
if (!session?.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
// session.user.id, session.user.email, session.user.name, session.user.role
```

### Admin-only routes

Check the role on the session:

```ts
if (session.user.role !== "admin") {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
```

To promote a user to admin, update the `role` column in the `users` table directly via Drizzle Studio or a migration.

---

## 11. Email Templates

Email templates live in `emails/`. They are written in React using the React Email component library, giving you full JSX control over HTML email layout.

### Available templates

| Template                  | File                              | Trigger                            |
| ------------------------- | --------------------------------- | ---------------------------------- |
| Magic link                | `emails/magic-link.tsx`           | User requests a magic link sign-in |
| Welcome                   | `emails/welcome.tsx`              | Sent after first sign-in           |
| Contact form confirmation | `emails/contact-confirmation.tsx` | Sent after contact form submission |

### Previewing templates locally

Add this script to `package.json` to preview templates in the browser:

```json
"email:preview": "email dev --dir emails"
```

Then run `bun email:preview` to open the React Email preview server at `http://localhost:3001`.

### Adding a new template

1. Create a new file in `emails/`, e.g., `emails/trial-ending.tsx`.
2. Build the template using React Email components (`<Html>`, `<Body>`, `<Text>`, `<Button>`, etc.).
3. Send it from a server action or API route:

```ts
import { Resend } from "resend"
import { TrialEndingEmail } from "@/emails/trial-ending"
import { env } from "@/env"

const resend = new Resend(env.RESEND_API_KEY)

await resend.emails.send({
  from: env.RESEND_FROM_EMAIL,
  to: user.email,
  subject: "Your trial ends in 3 days",
  react: <TrialEndingEmail userName={user.name} trialEndDate={trialEnd} />,
})
```

---

## 12. Tier and Access Control

### The three tiers

| Key        | Name     | Access                                                        |
| ---------- | -------- | ------------------------------------------------------------- |
| `starter`  | Starter  | Free, always available                                        |
| `pro`      | Pro      | Requires active Pro subscription                              |
| `business` | Business | Requires active Business subscription, or a lifetime purchase |

### Checking access in server components and API routes

```ts
import { getUserAccessLevel } from "@/lib/payments/subscription-state"

const access = await getUserAccessLevel(session.user.id)

if (!access.hasActiveAccess) {
  redirect("/pricing")
}

if (access.tier === "starter") {
  // Show upsell
}
```

### Gating a specific feature

```ts
import { requireTier } from "@/lib/payments/subscription-state"

// Throws if the user's tier is below "pro"
await requireTier(session.user.id, "pro")
```

Catch the thrown error in your route handler and return a 403:

```ts
try {
  await requireTier(session.user.id, "pro")
} catch {
  return NextResponse.json(
    { error: "Upgrade to Pro to use this feature." },
    { status: 403 }
  )
}
```

### Access-granting subscription statuses

The following statuses grant access:

- `active`
- `trialing`
- `past_due` (grace period - do not lock out users immediately on a failed payment)

The following statuses deny access:

- `canceled`
- `incomplete`
- `unpaid`
- `paused`

---

## 13. Blog - MDX and Rich Text System

The blog supports two authoring modes:

- **MDX files** - write posts as `.mdx` files in `content/blog/`. Suitable for technical content with code blocks and custom components.
- **Tiptap editor** - a rich text editor available in the admin interface at `/admin/blog/new`. Suitable for non-technical authors who prefer a visual writing experience.

### Writing a post as an MDX file

Create a new `.mdx` file in `content/blog/`:

```
content/blog/my-first-post.mdx
```

Every post requires a frontmatter block at the top:

```mdx
---
title: "My First Post"
description: "A short description for SEO and post cards."
publishedAt: "2025-01-15"
category: "engineering"
draft: false
ogImage: "/blog/my-first-post-og.png"
---

Your post content goes here. You can use **Markdown**, JSX components, and code blocks.
```

### Frontmatter fields

| Field         | Required | Description                                                                 |
| ------------- | -------- | --------------------------------------------------------------------------- |
| `title`       | Yes      | Post title - used in the page `<title>` and OG tag                          |
| `description` | Yes      | Short description for SEO meta and post cards                               |
| `publishedAt` | Yes      | ISO date string - used for sorting and display                              |
| `category`    | No       | Must match a category slug you have created                                 |
| `draft`       | No       | `true` hides the post from public listing; visible in the admin drafts view |
| `ogImage`     | No       | Path to OG image in `/public/`. Defaults to a generated image if absent     |

### Creating a category

Categories are managed through the admin blog interface at `/admin/blog/categories`.

### Admin write and edit interface

The Tiptap-powered write and edit UI is available at `/admin/blog/new` and `/admin/blog/[slug]/edit`. It is protected by the `admin` role.

---

## 14. Admin Dashboard

The admin dashboard is available at `/admin`. It is protected by the `admin` role.

Features:

- User list with search and role management
- Subscription and payment overview
- Site analytics summary (PostHog data)
- Health check status

To access the admin dashboard on a fresh install:

1. Sign up for an account through the normal auth flow.
2. Open Drizzle Studio (`bun db:studio`).
3. Find your user in the `users` table and set `role` to `"admin"`.
4. Refresh the page - you will now see the admin nav item.

---

## 15. CI/CD Pipeline

The GitHub Actions pipeline runs on every push to `main` and on every pull request.

### Pipeline stages

1. **Lint** - runs ESLint across the entire codebase
2. **Type check** - runs `bunx tsc --noEmit` in strict mode
3. **Format check** - runs `prettier --check .` to catch unformatted files
4. **Build** - runs `bun run build`; fails the pipeline if the build fails
5. **Deploy** - triggers a Vercel deployment on successful builds to `main`

### Secrets required in GitHub

Go to your repository → **Settings → Secrets and variables → Actions** and add:

| Secret              | Value                                                           |
| ------------------- | --------------------------------------------------------------- |
| `VERCEL_TOKEN`      | From Vercel → Settings → Tokens                                 |
| `VERCEL_ORG_ID`     | From `.vercel/project.json` after running `vercel link` locally |
| `VERCEL_PROJECT_ID` | From `.vercel/project.json` after running `vercel link` locally |

To get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`:

```bash
bun add -g vercel
vercel link
# Follow the prompts to link to your Vercel project
cat .vercel/project.json
```

---

## 16. Customisation Checklist

Work through this list when adapting Oolvay for your own product:

- [ ] **`config/tiers.ts`** - Update plan names, descriptions, limits, and features
- [ ] **`lib/payments/price-map.ts`** - Add your actual provider price/variant/plan IDs
- [ ] **`app/(marketing)/`** - Replace all placeholder copy and images with your own
- [ ] **`emails/`** - Update email templates with your brand name, colours, and copy
- [ ] **`public/`** - Replace `favicon.ico`, `og-image.png`, and `logo.svg`
- [ ] **`app/layout.tsx`** - Update `<title>`, `description`, and `openGraph` metadata
- [ ] **`next.config.ts`** - Update `allowedDevOrigins` if needed
- [ ] **`robots.txt`** - Ensure your production domain is set as the canonical base
- [ ] **`sitemap.xml`** - The sitemap is auto-generated; verify the base URL is correct
- [ ] **`db/schema/`** - Add any product-specific tables your app needs
- [ ] **`components/shared/Navbar.tsx`** - Update navigation links
- [ ] **`components/shared/Footer.tsx`** - Update footer links and legal text
- [ ] **`.env.local`** - Switch from test keys to production keys before launch
- [ ] **Vercel environment variables** - Mirror production keys in the Vercel dashboard
- [ ] **Google OAuth** - Add your production redirect URI
- [ ] **LemonSqueezy or Razorpay** - Switch to live mode and live keys
- [ ] **Webhook URLs** - Update all webhook URLs to your production domain
- [ ] **`vercel.json` cron schedule** - Set to hourly if you are on Vercel Pro

---

## 17. Troubleshooting

### "Missing environment variable" on startup

The environment validation in `env.ts` crashes the process at startup if a required variable is missing. Check the error message - it will name the exact variable. Add it to `.env.local`.

### `.env.example` is out of date

Run `bun gen:env` to regenerate it from `env.ts`. The generated file is always in sync with the validation schema.

### Database migrations fail

- Confirm `DATABASE_URL` is pointing at the correct Neon branch.
- Run `bun db:studio` to inspect the current schema.
- If a migration was partially applied, check the `__drizzle_migrations` table for the last successful entry.
- In development only, `bun db:reset` will drop and recreate all tables from scratch.

### Google OAuth redirect mismatch

The Google OAuth callback URL in your Google Cloud Console must exactly match the URL your app uses. Common mismatches:

- `http://` vs `https://`
- `localhost:3000` vs `127.0.0.1:3000`
- Missing or extra trailing slash

### Webhook signature verification fails (400)

- Ensure `export const runtime = "nodejs"` is at the top of your webhook route. The Edge runtime cannot create the `Buffer` needed for HMAC verification.
- Confirm the webhook secret in your `.env.local` matches the one configured in the provider dashboard exactly.
- The raw body must be read with `Buffer.from(await req.arrayBuffer())` before any JSON parsing. Reading it as JSON first will break signature verification.

### Razorpay modal does not open

- Confirm `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set (note the `NEXT_PUBLIC_` prefix - server-only variables are not available in the browser).
- The Razorpay checkout script is loaded lazily by `<CheckoutButton>`. Check the browser console for script load errors.

### CDK deployment fails

- Run `aws sts get-caller-identity` to confirm your CLI credentials are valid.
- Confirm you have run `cdk bootstrap` for your account/region combination.
- Run `cdk diff` before `cdk deploy` to preview what will change.

### Session not persisting after login

- Confirm `BETTER_AUTH_SECRET` is set and has not changed. Changing this secret invalidates all existing sessions.
- Check that `NEXT_PUBLIC_APP_URL` matches the domain you are accessing the app on. A mismatch causes cookie domain issues.

### Preflight fails on CI but passes locally

- Run `bun format:check` locally to find formatting issues.
- Run `bun type-check` locally to surface any TypeScript errors that only appear in strict mode.
- Confirm your local Bun version matches the version pinned in `.bun-version` if one exists.

---

## 18. Licence

Oolvay is sold as a one-time purchase. Your licence grants you:

- The right to use Oolvay as the foundation for unlimited commercial projects
- The right to modify all source code
- The right to deploy to any hosting provider

Your licence does not grant you:

- The right to resell or redistribute the starter kit itself
- The right to create a competing starter kit product using Oolvay's code

---

_Built with care in India. Questions? Open an issue or email us at hello@oolvay.com_
