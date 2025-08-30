import { useState, useEffect } from "react";
import ContactList from "./ContactList";
import ContactForm from "./ContactForm";

function App() {
  const [contacts, setContacts] = useState([]);
  const [highlightId, setHighlightId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const base = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  const css = `
    .btn {
      border: 1px solid transparent;
      border-radius: 8px;
      padding: 0.4rem 0.7rem;
      font-weight: 600;
      cursor: pointer;
      appearance: none;
      transition: background-color .15s ease, box-shadow .15s ease, transform .02s ease;
    }
    .btn:active { transform: translateY(1px); }

    .btn--create { background:#22c55e; color:#fff; }
    .btn--create:hover { background:#16a34a; }
    .btn--create:focus { outline:3px solid rgba(34,197,94,.35); outline-offset:2px; }

    .btn--save { background:#facc15; color:#111827; }
    .btn--save:hover { background:#eab308; }
    .btn--save:focus { outline:2px solid #fde047; outline-offset:2px; }

    .btn--cancel { background:#ef4444; color:#fff; }
    .btn--cancel:hover { background:#dc2626; }

    .modal {
      position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      display: grid; place-items: center; z-index: 50;
    }
    .modal-content {
      width: min(560px, 92vw);
      background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
      box-shadow: 0 10px 30px rgba(0,0,0,.15);
      padding: 1rem 1.25rem; position: relative;
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: .75rem;
    }
    .close {
      font-size: 1.5rem; line-height: 1; cursor: pointer; user-select: none; padding: 0 .25rem;
      border-radius: 8px; border: 1px solid transparent; background: transparent;
    }
    .edit-grid {
      display: grid; grid-template-columns: 140px 1fr; gap: .75rem 1rem; align-items: center; margin: .5rem 0 1rem;
    }
    .edit-grid label { font-weight: 600; text-align: right; padding-right: .25rem; }
    .edit-grid input {
      width: 100%; padding: .5rem .65rem; border: 1px solid #d1d5db; border-radius: 8px; outline: none;
    }
    .edit-grid input:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,.15); }
    .actions-row { display:flex; gap:.5rem; justify-content:flex-end; }
  `;

  const fetchContacts = async () => {
    const res = await fetch(`${base}/contacts`);
    const data = await res.json();
    setContacts(data.contacts || []);
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleCreated = (created) => {
    setIsCreateOpen(false);
    if (created?.id) {
      setContacts((prev) => [created, ...prev]);
      setHighlightId(created.id);
      setTimeout(() => setHighlightId(null), 3000);
    } else {
      fetchContacts();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${base}/contacts/${id}`, { method: "DELETE" });
    if (res.ok) setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const openUpdate = (contact) => {
    setEditing(contact);
    setEditFirstName(contact.firstName);
    setEditLastName(contact.lastName);
    setEditEmail(contact.email);
    setIsUpdateOpen(true);
  };

  const closeUpdate = () => {
    setIsUpdateOpen(false);
    setEditing(null);
  };

  const saveUpdate = async () => {
    if (!editing) return;
    const res = await fetch(`${base}/contacts/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: editFirstName, lastName: editLastName, email: editEmail }),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(payload.message || "Update failed");
      return;
    }
    const updated = payload.contact || { ...editing, firstName: editFirstName, lastName: editLastName, email: editEmail };
    setContacts((prev) => prev.map((c) => (c.id === editing.id ? updated : c)));
    setHighlightId(editing.id);
    setTimeout(() => setHighlightId(null), 2000);
    closeUpdate();
  };

  return (
    <>
      <style>{css}</style>

      <ContactList
        contacts={contacts}
        highlightId={highlightId}
        onUpdate={openUpdate}
        onDelete={handleDelete}
      />

      <button className="btn btn--create" onClick={() => setIsCreateOpen(true)}>
        Create new Contact
      </button>

      {isCreateOpen && (
        <div className="modal" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Contact</h3>
              <button className="close" onClick={() => setIsCreateOpen(false)}>&times;</button>
            </div>
            <ContactForm onCreated={handleCreated} />
          </div>
        </div>
      )}

      {isUpdateOpen && (
        <div className="modal" onClick={closeUpdate}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Contact</h3>
              <button className="close" onClick={closeUpdate}>&times;</button>
            </div>

            <div className="edit-grid">
              <label htmlFor="editFirstName">First Name:</label>
              <input
                id="editFirstName"
                type="text"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
              />

              <label htmlFor="editLastName">Last Name:</label>
              <input
                id="editLastName"
                type="text"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
              />

              <label htmlFor="editEmail">Email:</label>
              <input
                id="editEmail"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>

            <div className="actions-row">
              <button className="btn btn--cancel" onClick={closeUpdate}>Cancel</button>
              <button className="btn btn--save" onClick={saveUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;