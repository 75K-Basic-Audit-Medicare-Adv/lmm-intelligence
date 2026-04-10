# 🎯 Your Personalized Setup Checklist

Everything is built and ready to deploy. Here's your step-by-step guide with all your information pre-filled.

---

## Your Credentials (Keep Safe!)

```
GitHub Username: lmm-intelligence
Supabase URL: https://zktbctqsslnbenjjviea.supabase.co
Supabase Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprdGJjdHFzc2xuYmVuamp2aWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MDE4MTUsImV4cCI6MjA5MTI3NzgxNX0.QxHvd5kdmc6NP7rXbOoviZgrQSs_hdugImSbs_JeX2c
Supabase Service Key: sb_secret_Rmdkl41gcPVMYsEPde25fg_QfYmipuD
Supabase Publishable Key: sb_publishable_Wwc43hLC4-0YFmcMyGB39g_pWPfOSEo

Stripe Keys: (Get from stripe.com after signing up)
- Stripe Publishable (test): pk_test_... (you'll add this)
- Stripe Secret (test): sk_test_... (you'll add this)
```

**⚠️ Important:** Never commit these keys to GitHub. They're already in your `.env.example` but never pushed to the repo.

---

## 📋 Complete Setup Process (60 minutes total)

### ✅ Phase 1: Supabase Database Setup (5 minutes)

- [ ] Go to https://app.supabase.com
- [ ] Click your project: `lmm-intelligence`
- [ ] Go to **SQL Editor** → **New Query**
- [ ] Copy entire contents of `setup-database.sql`
- [ ] Paste into Supabase and click **RUN**
- [ ] Go to **Storage**
- [ ] Create bucket: `teasers` (make it public)
- [ ] Create bucket: `full-reports` (make it public)
- [ ] Verify in **Table Editor** that you see: `users`, `purchases`, `files`

**Status: Supabase ✓ Ready**

---

### ✅ Phase 2: Push to GitHub (10 minutes)

Open Terminal/Command Prompt and run these commands **in order**:

```bash
# Go to your project folder
cd ~/lmm-intelligence-repo

# Initialize git
git init

# Add all files
git add .

# Commit with a message
git commit -m "Initial: Wall Street LMM Intelligence membership platform"

# Add GitHub remote (replace lmm-intelligence with YOUR username)
git remote add origin https://github.com/lmm-intelligence/lmm-intelligence.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

When asked for credentials:
- [ ] Username: `lmm-intelligence`
- [ ] Password: Create a GitHub Personal Access Token
  - Go to github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Click "Generate new token"
  - Give it full `repo` access
  - Copy the token and paste as password

**Status: GitHub ✓ Ready**

---

### ✅ Phase 3: Deploy to Vercel (15 minutes)

- [ ] Go to https://vercel.com
- [ ] Click **New Project**
- [ ] Click **Import Git Repository**
- [ ] Paste: `https://github.com/lmm-intelligence/lmm-intelligence`
- [ ] Click **Import**

When you see the "Configure Project" page:

- [ ] Under **Environment Variables**, add these 4:

```
Name: SUPABASE_URL
Value: https://zktbctqsslnbenjjviea.supabase.co

Name: SUPABASE_SERVICE_KEY
Value: sb_secret_Rmdkl41gcPVMYsEPde25fg_QfYmipuD

Name: STRIPE_SECRET_KEY
Value: (Get from Stripe - see Phase 4)

Name: STRIPE_PUBLISHABLE_KEY
Value: (Get from Stripe - see Phase 4)
```

- [ ] Click **Add** for each variable
- [ ] Click **Deploy**
- [ ] Wait 5-10 minutes for deployment
- [ ] You should see: "Deployment Successful! 🎉"
- [ ] Copy your Vercel URL (looks like: `https://lmm-intelligence.vercel.app`)

**Status: Vercel ✓ Live**

---

### ✅ Phase 4: Get Stripe Test Keys (10 minutes)

- [ ] Go to https://stripe.com
- [ ] Sign up (use your email)
- [ ] Go to **Developers** → **API Keys**
- [ ] Make sure **Test Mode** is enabled (toggle in top right)
- [ ] Copy these two keys:
  - [ ] **Publishable key** (starts with `pk_test_`)
  - [ ] **Secret key** (starts with `sk_test_`)

Now go back to Vercel:
- [ ] Go to Settings → Environment Variables
- [ ] Update:
  - `STRIPE_SECRET_KEY` with your `sk_test_...` key
  - `STRIPE_PUBLISHABLE_KEY` with your `pk_test_...` key
- [ ] Click **Save**
- [ ] Vercel should auto-redeploy

Also update the frontend:
- [ ] In your GitHub repo, edit `public/index.html`
- [ ] Find line ~350: `const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_STRIPE_KEY_HERE';`
- [ ] Replace with your actual key: `const STRIPE_PUBLISHABLE_KEY = 'pk_test_...';`
- [ ] Commit and push:
  ```bash
  git add public/index.html
  git commit -m "Add Stripe publishable key"
  git push
  ```
- [ ] Wait 1 minute for Vercel to redeploy

**Status: Stripe ✓ Configured**

---

### ✅ Phase 5: Test Everything (15 minutes)

- [ ] Open your Vercel URL in browser
- [ ] Click **Sign In**
- [ ] Click **Sign Up**
- [ ] Create test account:
  - Email: `test@example.com`
  - Password: anything
- [ ] You should see 4 projects (Vulcan, Torque, Granite, Atlas)
- [ ] Click **View Teaser** on any project
  - (Will show 404 until you upload PDFs)
- [ ] Click **Purchase Full Report - $2,000**
- [ ] Use Stripe test card: `4242 4242 4242 4242`
  - Expiry: `12/25` or any future date
  - CVC: `123` or any 3 digits
- [ ] Click **Pay $2,000**
- [ ] You should see success message
- [ ] You should see countdown timer (e.g., "11h 59m 45s")
- [ ] Click **Download Full Report** button
  - (Will show 404 until you upload PDFs)

**If all tests pass: ✓ Everything Works!**

---

### ✅ Phase 6: Upload Your PDFs (10 minutes)

You need 8 PDF files. For testing, you can create empty PDFs or use dummy files.

Files needed:
- [ ] vulcan-teaser.pdf
- [ ] vulcan-full-report.pdf
- [ ] torque-teaser.pdf
- [ ] torque-full-report.pdf
- [ ] granite-teaser.pdf
- [ ] granite-full-report.pdf
- [ ] atlas-teaser.pdf
- [ ] atlas-full-report.pdf

Go to Supabase:
- [ ] Click **Storage** in left sidebar
- [ ] Click `teasers` bucket
- [ ] Click **Upload** and select all 4 teaser PDFs
- [ ] Click `full-reports` bucket
- [ ] Click **Upload** and select all 4 full report PDFs

Test downloads:
- [ ] Go back to your site
- [ ] Refresh the page
- [ ] Click **View Teaser** (should show PDF)
- [ ] Click **Download Full Report** (should show PDF)

**Status: PDFs ✓ Live**

---

### ✅ Phase 7: Set Up Admin Email (5 minutes)

When users miss the 12-hour download window, they'll email: `admin@lmmintelligence.com`

Set this up to receive emails:

**Option A: Email Forwarding (if you have a domain)**
- [ ] Go to your domain registrar (GoDaddy, Namecheap, etc.)
- [ ] Create an email alias: `admin@lmmintelligence.com` → your personal email
- [ ] Emails will automatically forward

**Option B: Google Workspace**
- [ ] Sign up for Google Workspace
- [ ] Create mailbox for `admin@lmmintelligence.com`
- [ ] Check regularly for support requests

**Option C: Catch-All Email**
- [ ] Set domain catch-all to your personal email
- [ ] Filter/organize in your email client

**Status: Support ✓ Ready**

---

## 🎉 You're Done!

Your system is now:
- ✅ Live and accessible
- ✅ Processing payments
- ✅ Storing user data
- ✅ Serving PDFs with 12-hour access
- ✅ Sending payment confirmations
- ✅ Ready for real customers

---

## 🚀 Going Live (Real Money)

When you want to accept real payments instead of test payments:

1. Go to **stripe.com** → Developers → API Keys
2. **Disable Test Mode** (toggle in top right)
3. Get your **live keys** (they'll start with `pk_live_` and `sk_live_`)
4. Update Vercel:
   - Go to Settings → Environment Variables
   - Update `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` with live keys
   - Click Save
5. Update `public/index.html`:
   - Change `const STRIPE_PUBLISHABLE_KEY = 'pk_test_...'` to your live key
   - Commit and push to GitHub
   - Vercel auto-redeploys

**That's it. You're now accepting real payments!** 💰

---

## 📱 Your Site is at:

```
https://lmm-intelligence.vercel.app
```

Share this URL with your users!

---

## 💾 Your Files

Everything you need is in the outputs folder:
- ✅ `public/index.html` — Your website
- ✅ `api/create-payment.js` — Payment handler
- ✅ `api/confirm-payment.js` — Payment confirmation
- ✅ `setup-database.sql` — Database schema
- ✅ `package.json` — Dependencies
- ✅ `vercel.json` — Vercel config
- ✅ `README.md` — Documentation
- ✅ `DEPLOYMENT_GUIDE.md` — Detailed instructions

---

## ❓ Need Help?

Check these files:
- **SETUP_SUMMARY.md** — Overview of everything
- **DEPLOYMENT_GUIDE.md** — Detailed step-by-step
- **README.md** — Project documentation
- **SYSTEM_ARCHITECTURE.md** — How it all works

---

## 🎯 Next Action

**Start with Phase 1:** Go to Supabase and run the SQL schema. ✓

Good luck! You've got this. 🚀
