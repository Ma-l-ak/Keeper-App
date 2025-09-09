import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import env from "dotenv";
import jwt from "jsonwebtoken";
const app = express();
env.config();

const PORT = 5000;
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
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
  
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user; 
    next();
  });
}

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
      const token = generateToken(user);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
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
          const result = await db.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hash]
          );
          //console.log("Register response user:", result.rows[0]);
          //res.status(201).json({ message: "User registered successfully!", user: result.rows[0] });
          const user = result.rows[0];
          const token = generateToken(user);
          res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error registering user" });
  }
});
app.post("/notes", authenticateToken,async (req, res) => {
   console.log("Decoded user from token:", req.user);
  const { title, content } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding note" });
  }
});
app.get("/notes",authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM notes WHERE user_id = $1", [
      req.user.id,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notes" });
  }
});
app.delete("/notes/:id",authenticateToken, async (req, res) => {
  const noteId = req.params.id;
  try {
    await db.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [noteId, req.user.id]);
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting note" });
  }
});

app.put("/notes/:id", authenticateToken,async (req, res) => {
  const noteId = req.params.id;
  const { title, content } = req.body;
  console.log(
    `Updating note ${noteId} with title: ${title}, content: ${content}`
  );
  try {
    const result = await db.query(
      "UPDATE notes SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [title, content, noteId, req.user.id]
    );
    //res.json(result.rows[0]);
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
