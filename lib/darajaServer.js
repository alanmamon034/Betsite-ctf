// lib/darajaServer.js
// Server-side only. Never import this from a component that renders in
// the browser — it uses the real Consumer Key/Secret and must not end up
// in the client JS bundle. That's why none of these env vars are
// NEXT_PUBLIC_-prefixed.

const BASE_URL = "https://sandbox.safaricom.co.ke"; // sandbox, not production

export async function getAccessToken() {
  const consumerKey = process.env.DARAJA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET_REAL;

  if (!consumerKey || !consumerSecret) {
    throw new Error(
      "Missing DARAJA_CONSUMER_KEY / DARAJA_CONSUMER_SECRET env vars"
    );
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  const res = await fetch(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${credentials}` },
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Daraja auth failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  return data.access_token;
}

function timestampNow() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

export async function stkPush({ phone, amount, accountRef, callbackUrl }) {
  const shortcode = process.env.DARAJA_SHORTCODE_REAL;
  const passkey = process.env.DARAJA_PASSKEY_REAL;

  if (!shortcode || !passkey) {
    throw new Error(
      "Missing DARAJA_SHORTCODE_REAL / DARAJA_PASSKEY_REAL env vars"
    );
  }

  const token = await getAccessToken();
  const timestamp = timestampNow();
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
    "base64"
  );

  const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: accountRef || "BetsiteDeposit",
      TransactionDesc: "Betsite demo deposit",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`STK push failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}
