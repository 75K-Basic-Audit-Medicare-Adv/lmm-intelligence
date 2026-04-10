# Deployment Guide

Everything is ready. Follow these steps to get your system live.

---

## Step 1: Set Up Supabase Database (5 minutes)

### 1.1 Run the SQL Schema

1. Go to https://app.supabase.com
2. Click on your project: `lmm-intelligence`
3. In left sidebar, click **SQL Editor**
4. Click **New Query**
5. Copy the entire contents of `setup-database.sql` file
6. Paste it into the query editor
7. Click the **RUN** button (execute icon)

You should see: "Rows affected: 0" (this means the tables were created successfully)

### 1.2 Create Storage Buckets

1. In the left sidebar, click **Storage**
2. Click **Create new bucket**
3. Name it: `teasers` (make sure it's **public**)
4. Click **Create bucket**
5. Repeat for `full-reports` bucket

Now you have two storage buckets for PDFs.

### 1.3 Verify Everything

1. Go to **Table Editor** in left sidebar
2. You should see these tables listed:
   - `users`
   - `purchases`
   - `files`

If they're there, **Supabase is ready!** ✓

---

## Step 2: Push to GitHub (10 minutes)

### 2.1 Make sure you have Git installed

Open Terminal/Command Prompt and run:
```bash
git --version
```

If you see a version number, you're good. If not, install Git from git-scm.com.

### 2.2 Initialize Git Repository

In your terminal, run these commands **in order**:

```bash
cd ~/lmm-intelligence-repo
```

(or wherever you saved the files)

Then:
```bash
git init
git add .
git commit -m "Initial setup: membershiapsystem with Supabase, Stripe, 12-hour download window"
```

### 2.3 Push to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/lmm-intelligence.git
git branch -M main
git push -u origin main
```

When prompted for credentials:
- Username: `YOUR_USERNAME`
- Password: **Use your GitHub personal access token** (not your password)
  - Go to github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Click "Generate new token"
  - Give it access to: `repo`
  - Copy the token and paste it as password

**Done!** Your code is now on GitHub. ✓

---

## Step 3: Deploy to Vercel (10 minutes)

### 3.1 Connect Vercel to GitHub

1. Go to https://vercel.com
2. Click **New Project**
3. Click **Import Git Repository**
4. Paste your repo URL: `https://github.com/YOUR_USERNAME/lmm-intelligence`
5. Click **Import**

### 3.2 Add Environment Variables

Before deploying, add your secret keys:

1. You should see a form that says "Environment Variables"
2. Add these 4 variables:

```
SUPABASE_URL = https://zktbctqsslnbenjjviea.supabase.co

SUPABASE_SERVICE_KEY = sb_secret_Rmdkl41gcPVMYsEPde25fg_QfYmipuD

STRIPE_SECRET_KEY = sk_test_YOUR_STRIPE_KEY (you'll add this later)

STRIPE_PUBLISHABLE_KEY = pk_test_YOUR_STRIPE_KEY (you'll add this later)
```

**For Stripe keys**, you need to get them from Stripe first (see Step 4 below).

### 3.3 Deploy

Click **Deploy**

Wait ~5 minutes. You should see "Deployment Successful!" ✓

Vercel will give you a URL like: `https://lmm-intelligence.vercel.app`

**Your site is now live!**

---

## Step 4: Get Stripe Test Keys (5 minutes)

### 4.1 Create Stripe Account

1. Go to https://stripe.com
2. Sign up or sign in
3. Go to Developers → API Keys
4. Make sure **Test Mode** is enabled (toggle in top right)

### 4.2 Copy Your Keys

You'll see:
- **Publishable key** (starts with `pk_test_`)
- **Secret key** (starts with `sk_test_`)

Copy both.

### 4.3 Add to Vercel

1. Go to Vercel → Your project → Settings → Environment Variables
2. Update:
   - `STRIPE_PUBLISHABLE_KEY` = your pk_test_... key
   - `STRIPE_SECRET_KEY` = your sk_test_... key
3. Click Save
4. **Redeploy** (Vercel should auto-redeploy, or manually trigger it)

### 4.4 Update Frontend

In your GitHub repo, edit `public/index.html`:

Find this line (around line 350):
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_STRIPE_KEY_HERE';
```

Replace `pk_test_YOUR_STRIPE_KEY_HERE` with your actual Stripe publishable key.

Commit and push:
```bash
git add public/index.html
git commit -m "Add Stripe publishable key"
git push
```

Vercel auto-redeploys. Wait 1 minute.

---

## Step 5: Test Everything (10 minutes)

### 5.1 Test Sign Up

1. Go to your Vercel URL: `https://lmm-intelligence.vercel.app`
2. Click **Sign In**
3. Click **Sign Up**
4. Create account with test email: `test@example.com`
5. Password: anything

You should see the 4 projects (Vulcan, Torque, Granite, Atlas).

### 5.2 Test View Teaser

1. Click **View Teaser** on any project
2. You should see the PDF (or 404 if you haven't uploaded files yet)

### 5.3 Test Payment

1. Click **Purchase Full Report - $2,000**
2. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: `12/25` (any future date)
   - CVC: `123` (any 3 digits)
3. Click Pay

You should see:
- "Payment successful! Download available for 12 hours."
- Countdown timer showing (e.g., "11h 59m 45s")
- "Download Full Report" button active

Click it to download (will be 404 until you upload files).

### 5.4 Wait for Timer

After 12 hours (or manually wait if testing), the button should change to "Download Expired" with admin email link.

**If everything works, you're done!** ✓

---

## Step 6: Upload Your PDFs (10 minutes)

### 6.1 Prepare Files

You need 8 PDF files:
- `vulcan-teaser.pdf`, `vulcan-full-report.pdf`
- `torque-teaser.pdf`, `torque-full-report.pdf`
- `granite-teaser.pdf`, `granite-full-report.pdf`
- `atlas-teaser.pdf`, `atlas-full-report.pdf`

(Use your actual PDFs or dummy files for testing)

### 6.2 Upload to Supabase

1. Go to Supabase → Storage
2. Click `teasers` bucket
3. Click **Upload** and add all 4 teaser PDFs
4. Click `full-reports` bucket
5. Click **Upload** and add all 4 full report PDFs

### 6.3 Set File Paths in Frontend (Optional)

The system automatically looks for files named:
- `/teasers/vulcan-teaser.pdf`
- `/full-reports/vulcan-full-report.pdf`
- etc.

If you named them differently, edit `public/index.html` and update the download links.

---

## Step 7: Set Up Admin Email (5 minutes)

Users will email `admin@lmmintelligence.com` if they miss the 12-hour window.

You should set this up to receive emails. Options:

### Option A: Email Forwarding (Easiest)

If your domain is with a registrar (GoDaddy, Namecheap, etc.):
1. Go to your domain settings
2. Create an email alias: `admin@lmmintelligence.com` → your personal email
3. Done! Emails forward automatically

### Option B: Google Workspace

1. Sign up for Google Workspace
2. Create a full mailbox for admin@lmmintelligence.com
3. Set up forwarding if you want
4. Check it regularly

### Option C: Catch-All Email

1. Set up a catch-all on your domain
2. All emails → your personal address
3. Filter/organize in your email client

---

## Going Live (Real Payments)

When you're ready to accept real money:

### 1. Get Live Stripe Keys

1. Go to stripe.com → Developers → API Keys
2. **Disable Test Mode**
3. Copy your **live** keys (start with `pk_live_` and `sk_live_`)

### 2. Update Vercel

1. Update environment variables:
   - `STRIPE_SECRET_KEY` → your sk_live_... key
   - `STRIPE_PUBLISHABLE_KEY` → your pk_live_... key
2. Redeploy

### 3. Update Frontend

Edit `public/index.html` and update:
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_live_YOUR_REAL_KEY';
```

Push to GitHub → Vercel auto-redeploys.

**You're now accepting real payments!** 🎉

---

## Troubleshooting

**"Can't push to GitHub"**
- Make sure you're using a GitHub personal access token (not your password)
- Verify your GitHub username is correct
- Run: `git remote -v` to check the remote URL

**"Vercel says 'Environment variables not found'"**
- Go to Settings → Environment Variables
- Make sure all 4 variables are added
- Click "Redeploy" after adding them

**"Stripe payments failing"**
- Check that keys are correct in Vercel
- Verify Test Mode is ON if using test keys
- Check browser console for errors

**"PDFs not loading"**
- Make sure files are uploaded to Supabase Storage
- Check that file names match (case-sensitive)
- Verify storage buckets are public

**"Can't access admin panel"**
- Sign in with `admin@lmmintelligence.com`
- In Supabase Users table, confirm the email is verified
- Refresh the page

---

## You're Done! 🚀

Your membership platform is now live with:
- ✅ User authentication
- ✅ Payment processing
- ✅ 12-hour download window
- ✅ Admin support email
- ✅ Real-time countdown timers

Questions? Check the README.md or contact your support team.

Good luck!
