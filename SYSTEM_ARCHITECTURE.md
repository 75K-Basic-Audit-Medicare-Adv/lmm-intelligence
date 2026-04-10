# System Architecture Overview

Your membership platform has 4 main pieces. Here's how they fit together:

---

## 🔵 1. SUPABASE (Database + File Storage)

**What it does:** Stores everything

**Includes:**
- **Authentication** — Users sign up/log in
- **Database** — Tracks users, purchases, files
- **Storage** — Holds your teaser PDFs and full reports

**Tables:**
- `users` — Email addresses
- `purchases` — Who bought what, when, and status
- `files` — References to PDFs in storage

**How you use it:**
1. Create account at supabase.com
2. Create tables using the SQL we provide
3. Upload PDFs to storage buckets
4. That's it — the code handles the rest

**Cost:** Free tier includes 500MB storage (plenty for your use case)

---

## 🟢 2. VERCEL (Your Web Server + API)

**What it does:** Runs your website and payment logic

**Includes:**
- **Frontend** (index.html) — What users see
- **API Functions** — Handle Stripe payments (serverless functions)

**Functions:**
- `create-payment.js` — Creates a Stripe payment intent
- `confirm-payment.js` — Confirms payment succeeded
- `check-payment.js` — Checks if user paid

**How you use it:**
1. Create account at vercel.com
2. Connect your GitHub
3. Push code to GitHub
4. Vercel auto-deploys (updates instantly)

**Cost:** Free tier is plenty (unlimited requests, serverless functions work)

**Example flow:**
```
User clicks "Buy Full Report"
    ↓
Frontend calls create-payment.js
    ↓
Vercel creates Stripe intent
    ↓
User enters card info
    ↓
Stripe processes payment
    ↓
Frontend calls confirm-payment.js
    ↓
Vercel updates Supabase (marks purchase as "completed")
    ↓
User sees "Download Full Report" button
```

---

## 🔴 3. STRIPE (Payment Processing)

**What it does:** Handles credit card payments securely

**Includes:**
- **Payment Processing** — Charges cards ($2,000 per report)
- **Test Mode** — Practice payments without real charges
- **Dashboard** — View all transactions

**How you use it:**
1. Create account at stripe.com
2. Get your API keys
3. Add them to Vercel environment variables
4. That's it — the code handles the rest

**Important:**
- Test Mode: Use test card `4242 4242 4242 4242` (free, fake charges)
- Live Mode: Switch when ready for real money
- All payment logic happens on Vercel (secure, never exposes card details)

**Cost:** 2.9% + $0.30 per transaction (only pay when you make money)

---

## 🟡 5. Download Expiration Window (12 Hours)

**Why 12 hours?**
After payment, users get 12 hours to download their report. After that, the download link expires.

**Why this matters:**
- Prevents indefinite sharing of the expensive report
- Balances user experience (plenty of time to download) vs. your IP protection
- Discourages casual sharing ("here's a download link anyone can use forever")
- Creates legitimate support demand (users who miss the window have reason to contact you)

**How it works:**
1. User pays $2,000
2. System sets a 12-hour countdown timer on their purchase
3. "Download Full Report" button shows the remaining time (e.g., "11h 59m 45s")
4. Timer counts down in real-time
5. After 12 hours, button changes to "Download Expired"
6. User sees: "Download window expired after 12 hours. Email admin@lmmintelligence.com for help"
7. You can manually resend the report if they email you

**Admin Contact Setup:**
You'll need to monitor admin@lmmintelligence.com for support requests. Consider:
- Forwarding it to your personal email
- Setting up an auto-response
- Creating a process to resend reports manually
- Tracking reasons people miss the window (helps with UX)

---

## 🟡 4. GITHUB (Code Repository)

**What it does:** Stores your code, connects to Vercel

**How you use it:**
1. Create account at github.com
2. Create a repository
3. Push your code to it
4. Vercel watches this repo and auto-deploys

**Why GitHub?** Vercel can't deploy code directly — it watches GitHub for changes.

---

## 🔗 How Everything Connects

```
1. User goes to your Vercel URL
   (Vercel serves index.html from your GitHub repo)

2. User signs up/logs in
   (Frontend talks to Supabase Auth)

3. User sees 4 projects with teasers
   (Supabase Storage serves PDF previews)

4. User clicks "Buy Full Report"
   (Frontend sends email + projectId to Vercel)

5. Vercel calls Stripe API
   (Creates a payment intent)

6. User enters card details
   (Sent directly to Stripe, never touches your server)

7. Stripe confirms payment
   (Frontend tells Vercel to confirm)

8. Vercel updates Supabase
   (Marks purchase as "completed" + sets 12-hour expiration)

9. User sees countdown timer
   (Real-time countdown shows hours, minutes, seconds remaining)

10. User downloads full report within 12 hours
    (Supabase Storage serves the PDF)

11. After 12 hours, download button changes to "Download Expired"
    (Shows admin email link for support)
```

---

## 🏗️ File Structure

```
Your GitHub Repo:
├── api/
│   ├── create-payment.js      ← Handles payment creation
│   ├── confirm-payment.js     ← Confirms payment succeeded
│   └── check-payment.js       ← Checks if user has access
│
├── public/
│   └── index.html             ← Your entire website
│                                 (React app, 1 file, 400 lines)
│
└── package.json               ← Dependencies (Stripe, Supabase)
```

That's it. Your entire system is:
- 1 HTML file (the website)
- 3 API functions (payment handling)
- 1 config file

No build tools, no framework complexity, just pure JavaScript that works.

---

## 🔐 Security

The system is built safely:

**What we never expose:**
- Stripe secret keys (only used on Vercel, never in browser)
- Database secrets (only used on Vercel)
- Card details (go directly to Stripe, never touch your server)

**What's public (safe to be):**
- Stripe publishable key (limited to your account)
- Supabase anonymous key (limited to reading public data)

**Real security layer:**
- Vercel serverless functions (run your code securely)
- Supabase Row Level Security (databases only serve what users should see)
- Stripe webhooks (we can verify payments came from Stripe)

---

## 💰 Cost Breakdown

**Minimum monthly cost: $0**

- Supabase: Free tier (500MB storage, unlimited users)
- Vercel: Free tier (unlimited requests)
- Stripe: 2.9% + $0.30 per transaction (only when you charge)
- GitHub: Free tier

**When you make $1,000:**
- You earn: $1,000
- Stripe takes: ~$30
- You keep: ~$970

**You pay nothing** unless you're making money.

---

## 📈 Scaling

The system scales for free:

- Supabase free tier: 500MB storage, 100k monthly active users
- Vercel free tier: Unlimited requests, auto-scaling
- Stripe: Handles millions of transactions per minute

If you hit these limits (which would mean you're very successful):
- Upgrade Supabase ($25/month)
- Upgrade Vercel ($20/month)
- Stripe stays the same

But you won't need to worry about this for years.

---

## 🚀 Next Steps

1. **Create accounts** — Supabase, Vercel, Stripe, GitHub (20 min)
2. **Set up database** — Run SQL queries in Supabase (10 min)
3. **Deploy** — Push code to GitHub, Vercel auto-deploys (10 min)
4. **Update credentials** — Add your API keys (5 min)
5. **Upload files** — Use admin panel (10 min)
6. **Test** — Use test Stripe card (5 min)
7. **Go live** — Swap test keys for live keys (2 min)

**Total time: ~60 minutes**

Once live, you can:
- Accept real payments
- Users download PDFs automatically after paying
- View all transactions in Stripe dashboard
- Manage users in Supabase dashboard
- Deploy updates by pushing to GitHub

That's it. You're ready to build a revenue-generating business. 🎯

