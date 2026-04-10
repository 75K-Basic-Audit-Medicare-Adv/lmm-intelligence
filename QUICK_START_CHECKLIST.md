# Quick Start Checklist

Complete these steps in order to launch your membership platform.

## ✅ Phase 1: Create Accounts (20 min)

- [ ] **Supabase**
  - Go to supabase.com
  - Sign up → Create project named `lmm-intelligence`
  - Wait for project to be ready
  - Copy Supabase URL from Settings → API
  - Copy Supabase Anon Key
  - Copy Service Role Key
  - **SAVE THESE THREE VALUES**

- [ ] **GitHub**
  - Go to github.com
  - Sign up (if needed)
  - Remember your username

- [ ] **Vercel**
  - Go to vercel.com
  - Sign up
  - Connect GitHub account

- [ ] **Stripe**
  - Go to stripe.com
  - Sign up → Skip to dashboard
  - Enable **Test Mode** (toggle, top right)
  - Go to Developers → API Keys
  - Copy **Publishable Key** (pk_test_...)
  - Copy **Secret Key** (sk_test_...)
  - **SAVE BOTH KEYS**

---

## ✅ Phase 2: Create Database (10 min)

- [ ] In Supabase → SQL Editor → New Query
- [ ] Copy and run the first SQL query (users, purchases, files tables)
- [ ] Copy and run the second SQL query (enable auth and RLS)
- [ ] Go to Authentication → Settings
  - Enable "Enable email confirmations"
  - Set Site URL to: `http://localhost:3000`
  - Set Redirect URLs to: `http://localhost:3000/auth/callback`

- [ ] In Storage section, create two buckets:
  - [ ] `teasers` (public)
  - [ ] `full-reports` (public)

---

## ✅ Phase 3: Deploy Backend (20 min)

- [ ] Create GitHub repo named `lmm-intelligence`
- [ ] Clone locally: `git clone https://github.com/YOUR_USERNAME/lmm-intelligence.git`
- [ ] Create these files in the repo:

```
lmm-intelligence/
├── api/
│   ├── create-payment.js      (copy from file provided)
│   ├── confirm-payment.js     (copy from file provided)
│   └── check-payment.js       (copy from file provided)
├── public/
│   └── index.html             (copy from file provided)
└── package.json               (copy below)
```

- [ ] **package.json contents:**
```json
{
  "name": "lmm-intelligence",
  "version": "1.0.0",
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "stripe": "^12.0.0"
  }
}
```

- [ ] Push to GitHub:
```bash
git add .
git commit -m "Initial setup"
git push origin main
```

---

## ✅ Phase 4: Deploy to Vercel (10 min)

- [ ] Go to **vercel.com** → Import Project
- [ ] Select your `lmm-intelligence` repository
- [ ] Before deploying, add Environment Variables:
  - `SUPABASE_URL` = (your Supabase URL)
  - `SUPABASE_SERVICE_KEY` = (your service key)
  - `STRIPE_SECRET_KEY` = (your sk_test_... key)
  - `STRIPE_PUBLISHABLE_KEY` = (your pk_test_... key)
- [ ] Click **Deploy**
- [ ] Copy your Vercel URL (something like `https://lmm-intelligence.vercel.app`)

---

## ✅ Phase 5: Update HTML File

In your Vercel repo, edit `public/index.html`:

Find these lines:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_KEY_HERE';
```

Replace with your actual values:
- [ ] `YOUR_SUPABASE_URL` → your Supabase URL
- [ ] `YOUR_SUPABASE_ANON_KEY` → your Supabase Anon Key
- [ ] `pk_test_YOUR_KEY_HERE` → your Stripe Publishable Key

Commit and push to GitHub → Vercel auto-redeploys.

---

## ✅ Phase 6: Upload Files

- [ ] Go to your site
- [ ] Sign up with a test email
- [ ] You should see 4 projects with "Teaser Available" status
- [ ] Click the user email → scroll to find **Admin Panel** button (only shows if email is admin@lmmintelligence.com)
- [ ] **To make yourself admin:** Edit in Supabase, users table, change your email to `admin@lmmintelligence.com`
- [ ] Go back to site, refresh, Admin Panel now appears
- [ ] Click Admin Panel → Upload Files
- [ ] Upload your teaser PDFs for each project
- [ ] Upload your full report PDFs for each project
- [ ] **IMPORTANT:** Set up email receiving at admin@lmmintelligence.com
  - [ ] Forward to your personal email, OR
  - [ ] Set up an auto-response, OR
  - [ ] Create a support process
  - Users will email here if they miss the 12-hour download window

---

## ✅ Phase 7: Test Everything

- [ ] Sign out and sign back in
- [ ] Click "View Teaser" on a project (should open PDF)
- [ ] Click "Purchase Full Report - $2,000"
- [ ] Use Stripe test card: **4242 4242 4242 4242**
  - Expiry: any future date (e.g., 12/25)
  - CVC: any 3 digits (e.g., 123)
- [ ] Complete payment
- [ ] You should see countdown timer (e.g., "11h 59m 45s")
  - Timer shows in green on the project card
  - Counts down in real-time
  - Shows hours, minutes, and seconds
- [ ] Click "Download Full Report" button
- [ ] Download completes successfully
- [ ] Wait 12 hours (or manually test by checking the code) to see "Download Expired" state
- [ ] Expired message shows admin email link

---

## ✅ Phase 8: Go Live (When Ready)

When you're ready to accept real payments:

1. Go to **stripe.com** → Disable Test Mode
2. Copy your **live** keys (`pk_live_` and `sk_live_`)
3. In Vercel:
   - Go to Settings → Environment Variables
   - Update `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` with live keys
4. That's it — all payments now go to your real Stripe account

---

## Common Issues

**"Can't see teaser PDF"**
- Make sure you uploaded it to the `teasers` bucket in Supabase Storage
- File name should be formatted: `projectid-teaser.pdf` (e.g., `vulcan-teaser.pdf`)

**"Payment fails"**
- Check Stripe keys are correct in Vercel environment variables
- Make sure Test Mode is ON if using test keys

**"Can't find Admin Panel"**
- Change your user's email in Supabase users table to `admin@lmmintelligence.com`
- Refresh the site

**"Email confirmations not working"**
- Go to Supabase → Authentication → Email Templates
- Check the email template is set up
- Go to Settings and make sure SMTP is configured (or use Supabase's built-in email)

**"Countdown timer doesn't show"**
- Make sure you refreshed the page after payment
- Timer updates every second automatically
- After 12 hours, it will show "Download Expired"

**"Users need to contact me after 12 hours"**
- Set up email receiving at admin@lmmintelligence.com
- Forward to your personal email, set up auto-response, or create a support ticket system
- Consider an auto-reply explaining the 12-hour window

---

## Questions?

Each error in the browser console will tell you exactly what's wrong. The Stripe and Supabase dashboards both have excellent logging to debug issues.

You've got this! 🚀
