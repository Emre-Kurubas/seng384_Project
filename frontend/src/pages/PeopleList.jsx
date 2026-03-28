import React, { useState, useEffect } from 'react';

const API_URL = '/api/people';

function PeopleList() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPeople(data);
      setError('');
    } catch (err) {
      setError('Failed to load people. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  // ── Edit handlers ──────────────────────────────────────────────
  const startEdit = (person) => {
    setEditingId(person.id);
    setEditName(person.full_name);
    setEditEmail(person.email);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditEmail('');
  };

  const saveEdit = async (id) => {
    if (!editName.trim() || !editEmail.trim()) {
      alert('Name and email are required.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: editName.trim(), email: editEmail.trim() }),
      });

      if (response.status === 200) {
        const updated = await response.json();
        setPeople((prev) => prev.map((p) => (p.id === id ? updated : p)));
        cancelEdit();
      } else if (response.status === 409) {
        alert('This email is already taken by another person.');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update.');
      }
    } catch (err) {
      alert('Failed to connect to the server.');
    }
  };

  // ── Delete handlers ────────────────────────────────────────────
  const confirmDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

      if (response.ok) {
        setPeople((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete person.');
      }
    } catch (err) {
      alert('Failed to connect to the server.');
    }
    setDeleteConfirm(null);
  };

  // ── Render ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading people...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card list-card">
        <div className="card-header">
          <h1>Registered People</h1>
          <p className="card-subtitle">
            {people.length} {people.length === 1 ? 'person' : 'people'} registered
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">✕</span> {error}
            <button className="btn btn-sm" onClick={fetchPeople}>Retry</button>
          </div>
        )}

        {people.length === 0 && !error ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p>No people registered yet.</p>
            <a href="/" className="btn btn-primary">Register Someone</a>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  <tr key={person.id}>
                    {editingId === person.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            className="edit-input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            className="edit-input"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                          />
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-success btn-sm" onClick={() => saveEdit(person.id)}>Save</button>
                            <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{person.full_name}</td>
                        <td>{person.email}</td>
                        <td>
                          {deleteConfirm === person.id ? (
                            <div className="action-buttons">
                              <span className="confirm-text">Delete?</span>
                              <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(person.id)}>Yes</button>
                              <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>No</button>
                            </div>
                          ) : (
                            <div className="action-buttons">
                              <button className="btn btn-edit btn-sm" onClick={() => startEdit(person)}>Edit</button>
                              <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(person.id)}>Delete</button>
                            </div>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PeopleList;
