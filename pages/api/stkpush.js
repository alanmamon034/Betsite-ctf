// pages/api/mpesa/stkpush.js
// Triggers a real Daraja SANDBOX STK push (test money only, no real charges).
// Only works for the sandbox test number 254708374149 — real phones will
// not receive a prompt in sandbox mode.

import { stkPush } from "../../../lib/darajaServer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { phone, amount } = req.body || {};

  if (!phone || !amount) {
    return res.status(400).json({ error: "phone and amount are required" });
  }

  // Build an absolute callback URL from the incoming request so this
  // works both locally (with a tunnel) and once deployed on Vercel.
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const callbackUrl = `${proto}://${host}/api/mpesa/callback`;

  try {
    const result = await stkPush({ phone, amount, callbackUrl });
    return res.status(200).json(result);
  } catch (err) {
    console.error("STK push error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
