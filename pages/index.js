import { useState } from "react";

/*
  TODO before launch: remove this test token, was only for the staging
  webhook while Daraja sandbox was flaky.
  STAGING_WEBHOOK_TOKEN=FAKE_WH_TOKEN_3d8f1c
*/

export default function Home() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  async function handleDeposit(e) {
    e.preventDefault();
    setMessage("Sending STK push...");
    try {
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage(
          `Sent. ${data.CustomerMessage || data.ResponseDescription || "Check the sandbox test phone."}`
        );
      }
    } catch (err) {
      setMessage(`Request failed: ${err.message}`);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>PesaBet (demo)</h1>
      <p>Training/demo betting UI — mock M-Pesa STK push deposit form.</p>
      <form onSubmit={handleDeposit}>
        <div style={{ marginBottom: 12 }}>
          <label>Phone number</label>
          <br />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="254708374149 (sandbox test number)"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Amount (KES)</label>
          <br />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
          />
        </div>
        <button type="submit">Deposit</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}
