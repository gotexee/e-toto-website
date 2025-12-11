const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM todo");
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération tâches", error: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query("SELECT * FROM todo WHERE id = ?", [id]);
    if (result.length === 0)
      return res.status(404).json({ message: "Tâche non trouvée" });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération tâche", error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, created_at, due_time, status, user_id } = req.body;
    if (!title || !description || !created_at || !due_time || !status || !user_id)
      return res.status(400).json({ message: "Tous les champs sont requis" });

    const [result] = await db.query(
      "INSERT INTO todo (title, description, created_at, due_time, status, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, created_at, due_time, status, user_id]
    );

    res.status(201).json({ message: "Tâche créée avec succès", taskId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Erreur création tâche", error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, created_at, due_time, status, user_id } = req.body;

    if (!title || !description || !created_at || !due_time || !status || !user_id)
      return res.status(400).json({ message: "Tous les champs sont requis" });

    const [result] = await db.query(
      "UPDATE todo SET title = ?, description = ?, created_at = ?, due_time = ?, status = ?, user_id = ? WHERE id = ?",
      [title, description, created_at, due_time, status, user_id, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Tâche non trouvée" });

    res.json({ message: "Tâche mise à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur mise à jour tâche", error: err });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query("DELETE FROM todo WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Tâche non trouvée" });

    res.json({ message: "Tâche supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression tâche", error: err });
  }
});

module.exports = router;
