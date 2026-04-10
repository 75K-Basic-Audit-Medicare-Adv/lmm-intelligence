# Wall Street LMM Intelligence – Complete Setup Guide

This guide walks you through building a complete membership + paywall system for your research reports.

**Total Setup Time: 3–4 hours**  
**Tech Required: Copying and pasting code. That's it.**

---

## Phase 1: Create Your Accounts (20 minutes)

### Step 1: Create Supabase Account
1. Go to **supabase.com** → Sign up with email
2. Create a new project (name it: `lmm-intelligence`)
3. Wait for it to be ready (shows green checkmark)
4. Save these credentials somewhere safe:
   - **Supabase URL** (copy from Settings → API)
   - **Supabase Anon Key** (same location)
   - **Supabase Service Role Key** (also in Settings)

### Step 2: Create Vercel Account
1. Go to **vercel.com** → Sign up
2. Connect your GitHub account (it will prompt you)
3. If you don't have GitHub: Go to **github.com**, sign up, come back here

### Step 3: Create Stripe Account
1. Go to **stripe.com** → Sign up
2. Skip to dashboard
3. Enable **Test Mode** (toggle in top right)
4. Go to **Developers** → **API Keys**
5. Copy your test keys:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

---

## Phase 2: Set Up Your Database (30 minutes)

Go to your Supabase dashboard → **SQL Editor** → Create a **New Query** and run each of these:

### Query 1: Create Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW(),
  download_expires_at TIMESTAMP
);

CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  project_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Files are publicly readable"
  ON files FOR SELECT
  USING (true);
```

### Query 2: Enable Auth
1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under "Email Auth", enable "Enable email confirmations"
3. Under "Providers", make sure "Email" is enabled
4. Go to **URL Configuration** and set:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: `http://localhost:3000/auth/callback`

---

## Phase 3: Create Storage Buckets (5 minutes)

In Supabase dashboard → **Storage**:

1. Create new bucket: `teasers` (public)
2. Create new bucket: `full-reports` (public)

---

## Phase 4: Set Up Vercel Functions (30 minutes)

### Step 1: Create GitHub Repository
1. Go to **github.com** → Create a new repository
2. Name it: `lmm-intelligence`
3. Click "Create repository"
4. Clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/lmm-intelligence.git
   cd lmm-intelligence
   ```

### Step 2: Create Project Structure
```
lmm-intelligence/
├── api/
│   ├── create-payment.js
│   ├── confirm-payment.js
│   └── check-purchase.js
├── public/
│   └── index.html
├── package.json
└── .env.local
```

### Step 3: Create `package.json`
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

### Step 4: Create `.env.local`
```
SUPABASE_URL=YOUR_SUPABASE_URL_HERE
SUPABASE_SERVICE_KEY=YOUR_SERVICE_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

### Step 5: Create Vercel Functions

**File: `api/create-payment.js`**
```javascript
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, projectId } = req.body;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 200000, // $2000.00 in cents
      currency: 'usd',
      metadata: {
        email,
        projectId,
      },
    });

    // Record in Supabase
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (user) {
      await supabase.from('purchases').insert({
        user_id: user.id,
        project_id: projectId,
        amount: 200000,
        stripe_payment_intent_id: paymentIntent.id,
        status: 'pending',
      });
    }

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ error: error.message });
  }
}
```

**File: `api/confirm-payment.js`**
```javascript
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentIntentId } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update purchase status in Supabase
      await supabase
        .from('purchases')
        .update({ status: 'completed' })
        .eq('stripe_payment_intent_id', paymentIntentId);

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Payment not completed' });
  } catch (error) {
    console.error('Confirmation error:', error);
    return res.status(500).json({ error: error.message });
  }
}
```

**File: `api/check-purchase.js`**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    const { email, projectId } = req.query;

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!user) {
      return res.status(200).json({ hasPurchased: false });
    }

    const { data: purchase } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .eq('status', 'completed')
      .single();

    return res.status(200).json({ hasPurchased: !!purchase });
  } catch (error) {
    return res.status(200).json({ hasPurchased: false });
  }
}
```

### Step 6: Deploy to Vercel
1. Go to **vercel.com** → Import Project
2. Select your GitHub repository
3. In **Environment Variables**, add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
4. Click Deploy
5. Copy your Vercel URL (you'll need it)

---

## Phase 5: Create Your Frontend (Your Vercel URL/index.html)

Copy the code from `index.html` file and paste it in **public/index.html** in your GitHub repo.

---

## Phase 6: Upload Files

Once deployed, go to your Vercel URL and:
1. Click **Admin Panel** (in top right)
2. Upload your teaser PDFs for each project (Vulcan, Torque, Granite, Atlas)
3. Upload your full report PDFs for each project

---

## Phase 7: Test Everything

1. Go to your site
2. Sign up with a test email
3. View the teasers
4. Use Stripe test card: `4242 4242 4242 4242` (expiry: any future date, CVC: any 3 digits)
5. Try to download a full report
6. After payment, you'll see a countdown timer showing time remaining (e.g., "11h 59m 45s")
7. Download completes normally while timer is active
8. After 12 hours, the download button changes to "Download Expired" with a link to email admin
9. Users can email admin@lmmintelligence.com for help if they miss the window

**Important:** Set up admin@lmmintelligence.com to be able to receive emails. You can:
- Forward it to your personal email
- Set up an auto-response explaining the 12-hour window
- Create a manual support process for requests

---

## Troubleshooting

**"Payment failed"** → Check Stripe keys in Vercel environment variables

**"Can't see teasers"** → Make sure files are uploaded to Supabase storage

**"Can't sign up"** → Check email auth is enabled in Supabase

Need help? Each error message will tell you exactly what's wrong.

---

## Swapping in Real Stripe Keys

When ready:
1. Go to **stripe.com** → Developers → API Keys (disable Test Mode)
2. Copy live keys (`pk_live_` and `sk_live_`)
3. Update in Vercel environment variables
4. That's it — everything else stays the same

