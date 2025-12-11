
const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


app.use(express.json());
app.use(cors());


const db = require("./config/db");

const userRoutes = require("./routes/user/userRoutes");
const todoRoutes = require("./routes/todos/todoRoutes");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }
cors
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const sql = "SELECT * FROM user WHERE email = ?";
    const [rows] = await db.query(sql, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login success",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstname: user.firstname
      }
    });

  } catch (err) {
    console.error("❌ ERREUR login:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 15);

    const sql = "INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)";
    const [rows] = await db.query(sql, [
      req.body.email,
      hashedPass,
      req.body.name,
      req.body.firstname
    ]);

    return res.json({ message: "Signup Success" });

  } catch (err) {
    console.error("❌ ERREUR signup:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/application", authMiddleware, (req, res) => {
  res.json({ message: "Accès autorisé", user: req.user });
});

app.get("/today", authMiddleware, (req, res) => {
  res.json({ message: "Accès autorisé à /today", user: req.user });
});

app.get("/history", authMiddleware, (req, res) => {
  res.json({ message: "Accès autorisé à /history", user: req.user });
});

app.get("/calendar", authMiddleware, (req, res) => {
  res.json({ message: "Accès autorisé à /calendar", user: req.user });
});

app.post("/tasks", async (req, res) => {
  try {
    const { title, description, date, dueTime, status } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const sql = `
      INSERT INTO todo (title, description, created_at, due_time, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      title,
      description,
      date,
      dueTime,
      status,
      user_id
    ]);

    const createdTask = {
      id: result.insertId,
      title,
      description,
      date,
      dueTime,
      status,
      user_id
    };

    return res.status(201).json({
      message: "Tâche créée avec succès",
      task: createdTask
    });

  } catch (err) {
    console.error("❌ ERREUR POST /tasks :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});


app.get("/tasks", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const sql = `
      SELECT id, title, description, created_at AS date, due_time AS dueTime, status
      FROM todo 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql, [user_id]);

    return res.json(rows);

  } catch (err) {
    console.error("❌ ERREUR corsGET /tasks :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, dueTime, status } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const sql = `
      UPDATE todo 
      SET title = ?, description = ?, created_at = ?, due_time = ?, status = ?
      WHERE id = ? AND user_id = ?
    `;

    const [result] = await db.query(sql, [
      title,
      description,
      date,
      dueTime,
      status,
      id,
      user_id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found or not yours" });
    }

    return res.json({ message: "Task updated successfully" });

  } catch (err) {
    console.error("❌ ERREUR PUT /tasks/:id :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    
    const sql = `DELETE FROM todo WHERE id = ? AND user_id = ?`;

    const [result] = await db.query(sql, [id, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found or not yours" });
    }

    return res.json({ message: "Task deleted successfully" });

  } catch (err) {
    console.error("❌ ERREUR DELETE /tasks/:id :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.use("/", userRoutes);
app.use("/todos", todoRoutes);

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user?.id;
    const sql = "SELECT id, email, name, firstname FROM user WHERE id = ?";
    const [rows] = await db.query(sql, [user_id]);
    if (!rows || rows.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
    return res.json(rows[0]);
  } catch (err) {
    console.error("❌ ERREUR GET /profile :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.put("/profile", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { email, name, firstname } = req.body;

    if (!email || !name || !firstname) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const [existing] = await db.query("SELECT id FROM user WHERE email = ? AND id != ?", [email, user_id]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    const sql = "UPDATE user SET email = ?, name = ?, firstname = ? WHERE id = ?";
    const [result] = await db.query(sql, [email, name, firstname, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json({ message: "Profil mis à jour avec succès" });
  } catch (err) {
    console.error("❌ ERREUR PUT /profile :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.listen(port, () => {
  console.log(`🟩 Service running at http://localhost:${port}`);
});
