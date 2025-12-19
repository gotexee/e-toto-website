import React, { useState, useEffect } from "react";
import axios from "axios";
import "./todolist.css";

export default function Calendar() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    dueTime: "",
    status: "todo",
  });

  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [overColumn, setOverColumn] = useState(null);
  const [profile, setProfile] = useState({
    open: false,
    name: "",
    firstname: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8080/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch(() => console.log("Erreur GET tasks"));
  }, []);

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (editId) {
      axios
        .put(`http://localhost:8080/tasks/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setTasks((prev) =>
            prev.map((t) => (t.id === editId ? { ...t, ...form } : t))
          );
        })
        .catch(() => alert("Erreur update tâche"));
    } else {
      axios
        .post("http://localhost:8080/tasks", form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setTasks((prev) => [...prev, res.data.task]);
        })
        .catch(() => alert("Erreur création tâche"));
    }

    setForm({ title: "", description: "", date: "", dueTime: "", status: "todo" });
    setEditId(null);
  };

  const handleEdit = (task) => {
    setForm(task);
    setEditId(task.id);
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    axios
      .delete(`http://localhost:8080/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      })
      .catch(() => alert("Erreur suppression"));
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
    setDraggingId(id);
  };

  const handleDrop = (e, newStatus) => {
    const id = e.dataTransfer.getData("id");
    const token = localStorage.getItem("token");

    const task = tasks.find((t) => t.id == id);
    if (!task) return;

    axios
      .put(
        `http://localhost:8080/tasks/${id}`,
        { ...task, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id == id ? { ...t, status: newStatus } : t
          )
        );
      });

    setDraggingId(null);
    setOverColumn(null);
  };

  const openProfile = () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Connecte-toi d'abord");

    axios
      .get("http://localhost:8080/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile({ open: true, ...res.data }))
      .catch(() => alert("Erreur profil"));
  };

  const saveProfile = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .put(
        "http://localhost:8080/profile",
        {
          email: profile.email,
          name: profile.name,
          firstname: profile.firstname,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => alert("Profil mis à jour"))
      .finally(() => setProfile({ ...profile, open: false }));
  };

  const TaskColumn = ({ title, status, icon }) => {
    const taskCount = tasks.filter((t) => t.status === status).length;
    
    return (
      <div
        className={`column ${overColumn === status ? "drag-over" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, status)}
        onDragEnter={() => setOverColumn(status)}
        onDragLeave={() => setOverColumn(null)}
      >
        <div className="column-header">
          <h2><span className="icon">{icon}</span>{title}</h2>
          <span className="task-count">{taskCount}</span>
        </div>

        {tasks
          .filter((t) => t.status === status)
          .map((task) => (
            <div
              key={task.id}
              className={`task ${draggingId === task.id ? "dragging" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragEnd={() => setDraggingId(null)}
            >
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p className="task-desc">{task.description}</p>}
                <div className="task-meta">
                  <span className="meta-item">📅 {task.date}</span>
                  <span className="meta-item">⏰ {task.dueTime}</span>
                </div>
              </div>

              <div className="task-actions">
                <button className="btn-edit" onClick={() => handleEdit(task)} title="Edit">✏️</button>
                <button className="btn-delete" onClick={() => handleDelete(task.id)} title="Delete">🗑️</button>
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <h1>📋 My Tasks</h1>
          <button className="profile-btn" onClick={openProfile}>👤 Profile</button>
        </div>
      </header>

      <div className="form-section">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              name="title"
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={handleFormChange}
              required
              className="form-input form-input-full"
            />
            
            <input
              name="description"
              type="text"
              placeholder="Description (optional)"
              value={form.description}
              onChange={handleFormChange}
              className="form-input form-input-full"
            />
            
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleFormChange}
              required
              className="form-input"
            />

            <input
              name="dueTime"
              type="time"
              value={form.dueTime}
              onChange={handleFormChange}
              required
              className="form-input"
            />

            <select 
              name="status" 
              value={form.status} 
              onChange={handleFormChange}
              className="form-input"
            >
              <option value="todo">📌 To Do</option>
              <option value="ongoing">⚡ Ongoing</option>
              <option value="done">✅ Done</option>
            </select>
          </div>

          <button type="submit" className="btn-submit">
            {editId ? "🔄 Update Task" : "➕ Add Task"}
          </button>
        </form>
      </div>

      <div className="columns">
        <TaskColumn title="To Do" status="todo" icon="📌" />
        <TaskColumn title="Ongoing" status="ongoing" icon="⚡" />
        <TaskColumn title="Done" status="done" icon="✅" />
      </div>

      {profile.open && (
        <div className="modal-overlay" onClick={() => setProfile({ ...profile, open: false })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>👤 Edit Profile</h3>
            <form onSubmit={saveProfile} className="profile-form">
              <label>
                <span>Name</span>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your name"
                />
              </label>

              <label>
                <span>First Name</span>
                <input
                  value={profile.firstname}
                  onChange={(e) => setProfile({ ...profile, firstname: e.target.value })}
                  placeholder="Your first name"
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="Your email"
                />
              </label>

              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setProfile({ ...profile, open: false })}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}