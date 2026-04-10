// api/confirm-payment.js
// This function confirms a Stripe payment succeeded and unlocks the full report

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

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Missing paymentIntentId' });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Calculate expiration time (12 hours from now)
      const expirationTime = new Date(Date.now() + 12 * 60 * 60 * 1000);

      // Update purchase status to completed with expiration time
      const { error } = await supabase
        .from('purchases')
        .update({ 
          status: 'completed',
          download_expires_at: expirationTime.toISOString()
        })
        .eq('stripe_payment_intent_id', paymentIntentId);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Payment confirmed and report unlocked for 12 hours',
        expiresAt: expirationTime.toISOString()
      });
    }

    return res.status(400).json({
      error: 'Payment not completed',
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error('Confirmation error:', error);
    return res.status(500).json({ error: error.message });
  }
}
