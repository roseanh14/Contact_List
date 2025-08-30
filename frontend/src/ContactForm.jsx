import { useState } from "react";

export default function ContactForm({ onCreated }) {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");

  const css = `
    .form-card {
      max-width: 520px;
      padding: 1rem 1.25rem;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      margin-top: 1rem;
    }
    .form-card h3 { margin: 0 0 0.9rem 0; font-size: 1.05rem; }
    .form-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 0.75rem 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }
    .form-grid label { font-weight: 600; text-align: right; padding-right: 0.25rem; }
    .form-grid input {
      width: 100%; padding: 0.5rem 0.65rem;
      border: 1px solid #d1d5db; border-radius: 8px; outline: none;
    }
    .form-grid input:focus {
      border-color: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
    }

    .btn {
      appearance: none;
      border: none;
      border-radius: 10px;
      padding: 0.55rem 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: background-color .15s ease, box-shadow .15s ease, transform .02s ease;
    }
    .btn:active { transform: translateY(1px); }

    .btn--create {
      background: #22c55e;
      color: #fff;
    }
    .btn--create:hover { background: #16a34a; }
    .btn--create:focus { outline: 3px solid rgba(34,197,94,0.35); outline-offset: 2px; }

    .btn--update {
      background: #f59e0b;
      color: #fff;
    }
    .btn--update:hover { background: #d97706; }
    .btn--update:focus { outline: 2px solid #fbbf24; outline-offset: 2px; }

    .btn--delete {
      background: #ef4444;
      color: #fff;
    }
    .btn--delete:hover { background: #dc2626; }
    .btn--delete:focus { outline: 2px solid #fca5a5; outline-offset: 2px; }
  `;

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = { firstName, lastName, email };
    const base = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    try {
      const response = await fetch(`${base}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(payload.message || `Failed to create contact (HTTP ${response.status}).`);
        return;
      }
      setFirstName(""); setLastName(""); setEmail("");
      if (payload.contact) onCreated?.(payload.contact);
      else onCreated?.();
    } catch {
      alert("Network/CORS error while creating contact.");
    }
  };

  return (
    <>
      <style>{css}</style>
      <form className="form-card" onSubmit={onSubmit}>
        <h3>Create Contact</h3>
        <div className="form-grid">
          <label htmlFor="firstName">First Name:</label>
          <input id="firstName" type="text" value={firstName}
                 onChange={(e) => setFirstName(e.target.value)} required />

          <label htmlFor="lastName">Last Name:</label>
          <input id="lastName" type="text" value={lastName}
                 onChange={(e) => setLastName(e.target.value)} required />

          <label htmlFor="email">Email:</label>
          <input id="email" type="email" value={email}
                 onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn--create">Create Contact</button>
      </form>
    </>
  );
}