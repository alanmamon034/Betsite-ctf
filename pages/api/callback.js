// pages/api/mpesa/callback.js
// Safaricom POSTs the transaction result here after the user enters (or
// cancels) their PIN on the sandbox test phone. Must always respond 200,
// otherwise Daraja retries 3 times then quarantines the app.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const body = req.body;
  console.log("M-Pesa callback received:", JSON.stringify(body, null, 2));

  // In a real app you'd look up the CheckoutRequestID here, match it to
  // the pending order/bet in your database, and mark it paid or failed
  // based on ResultCode (0 = success).
  const resultCode = body?.Body?.stkCallback?.ResultCode;
  const resultDesc = body?.Body?.stkCallback?.ResultDesc;
  console.log("Result:", resultCode, resultDesc);

  return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
}
