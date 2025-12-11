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

  // -----------------------------------------------
  // 1️⃣ Charger les tâches depuis la base de données
  // -----------------------------------------------
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

  // -----------------------------------------------
  // 2️⃣ Add / Update tâche via API
  // -----------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // MODE UPDATE
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
    }

    // MODE CREATE
    else {
      axios
        .post("http://localhost:8080/tasks", form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setTasks((prev) => [...prev, res.data.task]); // <-- la tâche créée par le backend
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

  // -----------------------------------------------
  // 3️⃣ Suppression dans la DB
  // -----------------------------------------------
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

  // -----------------------------------------------
  // 4️⃣ DRAG & DROP => Update du statut en DB
  // -----------------------------------------------
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

  // -----------------------------------------------
  // 5️⃣ PROFILE
  // -----------------------------------------------

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

  // -----------------------------------------------
  // 6️⃣ UI
  // -----------------------------------------------
  const TaskColumn = ({ title, status }) => (
    <div
      className={`column ${overColumn === status ? "drag-over" : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, status)}
      onDragEnter={() => setOverColumn(status)}
      onDragLeave={() => setOverColumn(null)}
    >
      <h2>{title}</h2>

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
            <div>
              <b>{task.title}</b>
              <p>{task.description}</p>
              <p>
                📅 {task.date} ⏰ {task.dueTime}
              </p>
            </div>

            <div>
              <button onClick={() => handleEdit(task)}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="container">
      <button className="profile-btn" onClick={openProfile}>Edit Profile</button>

      <h1>To Do List</h1>

      <form className="form" onSubmit={handleSubmit}>
        {["title", "description", "date", "dueTime"].map((field) => (
          <input
            key={field}
            name={field}
            type={field === "date" ? "date" : field === "dueTime" ? "time" : "text"}
            placeholder={field}
            value={form[field]}
            onChange={handleFormChange}
            required
          />
        ))}

        <select name="status" value={form.status} onChange={handleFormChange}>
          <option value="todo">To Do</option>
          <option value="ongoing">Ongoing</option>
          <option value="done">Done</option>
        </select>

        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <div className="columns">
        <TaskColumn title="To Do" status="todo" />
        <TaskColumn title="Ongoing" status="ongoing" />
        <TaskColumn title="Done" status="done" />
      </div>

      {profile.open && (
        <div className="modal-overlay" onClick={() => setProfile({ ...profile, open: false })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Profile</h3>
            <form onSubmit={saveProfile}>
              {["name", "firstname", "email"].map((field) => (
                <label key={field}>
                  {field}
                  <input
                    value={profile[field]}
                    onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                  />
                </label>
              ))}

              <div className="modal-buttons">
                <button type="button" onClick={() => setProfile({ ...profile, open: false })}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
