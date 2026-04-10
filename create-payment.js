// api/create-payment.js
// This function creates a Stripe payment intent for the frontend

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, projectId } = req.body;

    if (!email || !projectId) {
      return res.status(400).json({ error: 'Missing email or projectId' });
    }

    // Create Stripe payment intent ($2000 = 200000 cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 200000,
      currency: 'usd',
      metadata: {
        email,
        projectId,
      },
    });

    // Get or create user in Supabase
    let user = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!user.data) {
      // Create new user if doesn't exist
      const { data: newUser } = await supabase
        .from('users')
        .insert({ email })
        .select()
        .single();
      user.data = newUser;
    }

    // Record purchase attempt in Supabase
    await supabase.from('purchases').insert({
      user_id: user.data.id,
      project_id: projectId,
      amount: 200000,
      stripe_payment_intent_id: paymentIntent.id,
      status: 'pending',
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ error: error.message });
  }
}
