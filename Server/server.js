import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import env from "dotenv";

const app = express();
env.config();

const PORT = 5000;
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(bodyParser.json());

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const loginPassword = req.body.password;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(loginPassword, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      res.json({
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error during login" });
  }
});

app.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (checkResult.rows.length > 0) {
      console.log("Email already exists. Try logging in.");
      return res
        .status(400)
        .json({ error: "Email already exists. Try logging in." });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          await db.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
            [name, email, hash]
          );
          res.status(201).json({ message: "User registered successfully!" });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error registering user" });
  }
});
app.post("/notes", async (req, res) => {
  const { userId, title, content } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding note" });
  }
});
app.get("/notes/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await db.query("SELECT * FROM notes WHERE user_id = $1", [
      userId,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notes" });
  }
});
app.delete("/notes/:id", async (req, res) => {
  const noteId = req.params.id;
  try {
    await db.query("DELETE FROM notes WHERE id = $1", [noteId]);
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting note" });
  }
});

app.put("/notes/:id", async (req, res) => {
  const noteId = req.params.id;
  const { title, content } = req.body;
  console.log(
    `Updating note ${noteId} with title: ${title}, content: ${content}`
  );
  try {
    const result = await db.query(
      "UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *",
      [title, content, noteId]
    );
    res.json(result.rows[0]);
    //console.log("Note updated:", result.rows[0]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(result.rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating note" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
