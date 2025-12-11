const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




router.post("/register", async (req, res) => {
  try {
    const { email, password, name, firstname } = req.body;

    if (!email || !password || !name || !firstname) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const [existing] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }

    
    const [result] = await db.query(
      "INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)",
      [email, password, name, firstname]
    );

    res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      userId: result.insertId
    });

  } catch (err) {
    res.status(500).json({ message: "Erreur d'inscription", error: err });
  }
});



router.get("/user", async (req, res) => {
  try {
    const [result] = await db.query("SELECT id, email, name, firstname FROM user");
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération utilisateurs", error: err });
  }
});

router.get("/users/:param", async (req, res) => {
  try {
    const param = req.params.param;
    let query, value;

    if (isNaN(param)) {
      query = "SELECT id, email, name, firstname FROM user WHERE email = ?";
      value = param;
    } else {
      query = "SELECT id, email, name, firstname FROM user WHERE id = ?";
      value = parseInt(param);
    }

    const [result] = await db.query(query, [value]);
    if (result.length === 0)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération utilisateur", error: err });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { email, password, firstname, name } = req.body;
    if (!email || !password || !firstname || !name)
      return res.status(400).json({ message: "Tous les champs sont requis" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?",
      [email, hashedPassword, firstname, name, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur mise à jour utilisateur", error: err });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query("DELETE FROM user WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression utilisateur", error: err });
  }
});

router.get("/user/todos", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId)
      return res.status(400).json({ message: "L'ID utilisateur est requis (query ?user_id=)" });

    const [result] = await db.query("SELECT * FROM todo WHERE user_id = ?", [userId]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération des tâches utilisateur", error: err });
  }
});

module.exports = router;