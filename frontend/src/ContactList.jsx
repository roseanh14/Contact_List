import React from "react";
import "./ContactList.css";

const ContactList = ({ contacts = [], onUpdate, onDelete, highlightId }) => {
  return (
    <div className="contacts-wrap">
      <h2>Contacts</h2>

      {contacts.length === 0 ? (
        <p className="empty">No contacts yet.</p>
      ) : (
        <table className="contacts-table">
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th>Email</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => {
              const isNew = highlightId === contact.id;
              return (
                <tr key={contact.id} className={isNew ? "new-contact" : ""}>
                  <td>{contact.firstName}</td>
                  <td>{contact.lastName}</td>
                  <td>{contact.email}</td>
                  <td className="actions">
                    <button
                      type="button"
                      className="btn btn--update"
                      onClick={() => onUpdate && onUpdate(contact)}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn btn--delete"
                      onClick={() => onDelete && onDelete(contact.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactList;