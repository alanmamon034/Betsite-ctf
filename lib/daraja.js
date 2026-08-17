// lib/daraja.js
// NOTE: this is a mock integration for a training/demo app.
// All keys here are FAKE placeholders, not real Safaricom Daraja credentials.

// Mistake baked in on purpose: a "secret" pulled from a NEXT_PUBLIC_ env var.
// Anything prefixed NEXT_PUBLIC_ gets inlined into the client JS bundle by
// Next.js, so this "consumer key" ships straight to the browser.
const DARAJA_CONSUMER_KEY = process.env.NEXT_PUBLIC_DARAJA_CONSUMER_KEY;

export async function initiateStkPush(phone, amount) {
  // In a real integration this would call Safaricom's Daraja STK Push
  // endpoint from a server-side route, never from the browser.
  console.log("Using consumer key:", DARAJA_CONSUMER_KEY);

  return {
    ok: true,
    message: `Mock STK push sent to ${phone} for KES ${amount}`,
  };
}
