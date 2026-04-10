# Wall Street LMM Intelligence

A complete membership and paywall system for research reports with Supabase, Stripe, and Vercel.

## Features

- ✅ Free user signup and authentication
- ✅ Teaser PDFs for 4 research projects
- ✅ $2,000 per full report payment via Stripe
- ✅ 12-hour download window (prevents sharing)
- ✅ Real-time countdown timer
- ✅ Admin email support (admin@lmmintelligence.com)

## Quick Start

### 1. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Go to **SQL Editor**
3. Create a **New Query**
4. Copy the entire contents of `setup-database.sql`
5. Paste it into the query editor
6. Click **Run**

This creates all tables, enables authentication, and configures storage.

### 2. Create Storage Buckets

In Supabase:
1. Go to **Storage** (in left sidebar)
2. Create a new bucket named: `teasers` (make it public)
3. Create another bucket named: `full-reports` (make it public)

### 3. Configure Environment Variables

In Vercel (when you deploy):
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Your service role key
- `STRIPE_SECRET_KEY` - Your Stripe test secret key (sk_test_...)
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe test publishable key (pk_test_...)

### 4. Update Stripe Keys

In `public/index.html`, find this line:
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_STRIPE_KEY_HERE';
```

Replace `pk_test_YOUR_STRIPE_KEY_HERE` with your actual Stripe publishable key.

### 5. Deploy to Vercel

1. Push this repo to your GitHub account
2. Go to vercel.com
3. Import your repository
4. Add the environment variables
5. Deploy

## Testing

Use Stripe test card: **4242 4242 4242 4242**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

## Admin Panel

The admin panel is available to users with email `admin@lmmintelligence.com`. To access it:

1. Sign up with the email: `admin@lmmintelligence.com`
2. In Supabase, go to **Authentication** → **Users**
3. Confirm the email if needed
4. Go back to the app and you'll see **Admin Panel** button

In the admin panel, you can:
- Upload teaser PDFs (one per project)
- Upload full report PDFs (one per project)

### File Naming

Files should be named:
- Teasers: `vulcan-teaser.pdf`, `torque-teaser.pdf`, etc.
- Full Reports: `vulcan-full-report.pdf`, `torque-full-report.pdf`, etc.

## Projects

The system comes with 4 pre-configured projects:

1. **Project Vulcan** - Precision Manufacturing
2. **Project Torque** - ECommerce/Parts
3. **Project Granite** - Construction
4. **Project Atlas** - Industrial Tech

Edit the `projects` array in `public/index.html` to customize names and data.

## 12-Hour Download Window

After purchase, users have exactly 12 hours to download their report. After that:
- Download button changes to "Download Expired"
- Shows admin email link for support
- You can manually resend via admin@lmmintelligence.com

## Going Live

When ready for real payments:

1. Go to stripe.com → Developers → API Keys
2. Disable **Test Mode**
3. Copy your **live** keys (pk_live_... and sk_live_...)
4. In Vercel, update environment variables:
   - `STRIPE_SECRET_KEY` → live key
   - `STRIPE_PUBLISHABLE_KEY` → live key
5. Redeploy

That's it. Payments are now live.

## Troubleshooting

**"Can't see teasers"**
- Check that files are uploaded to `teasers` bucket in Supabase Storage

**"Payment fails"**
- Verify Stripe keys in Vercel environment variables
- Make sure Test Mode is ON if using test keys

**"Can't access admin panel"**
- Change your email to `admin@lmmintelligence.com` in Supabase Users table
- Refresh the page

**"Users miss 12-hour window"**
- Set up admin@lmmintelligence.com to receive emails
- Consider auto-response explaining the window
- Create manual resend process for support requests

## Support

For questions, contact: admin@lmmintelligence.com

---

Built with Supabase, Stripe, and Vercel.
