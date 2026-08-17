// pages/api/status.js
// A "health check" endpoint. Mistake baked in on purpose: a debug flag
// that, when set, dumps internal diagnostics — including secrets that
// should never leave the server.

export default function handler(req, res) {
  const { debug } = req.query;

  const basic = { status: "ok", service: "betsite-api", time: new Date().toISOString() };

  if (debug === "true") {
    // Someone left this in for local troubleshooting and it made it to prod.
    return res.status(200).json({
      ...basic,
      diagnostics: {
        darajaShortcode: process.env.DARAJA_SHORTCODE,
        darajaConsumerSecret: process.env.DARAJA_CONSUMER_SECRET,
        darajaPasskey: process.env.DARAJA_PASSKEY,
        adminDebugToken: process.env.ADMIN_DEBUG_TOKEN,
        env: process.env.NODE_ENV,
      },
    });
  }

  return res.status(200).json(basic);
}
