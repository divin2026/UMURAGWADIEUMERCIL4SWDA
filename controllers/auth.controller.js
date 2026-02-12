const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config');

/* REGISTER */
exports.register = async (req, res) => {
  try {
    const { username, password, role, department } = req.body;

    db.query(
      "SELECT id FROM users WHERE username=?",
      [username],
      async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length > 0) {
          return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO users (username,password,role,department) VALUES (?,?,?,?)",
          [username, hashedPassword, role, department],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: "User registered successfully" });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGIN */
exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=?",
    [username],
    async (err, users) => {
      if (err) return res.status(500).json({ error: err.message });

      if (users.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = users[0];

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          department: user.department
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      res.json({ token });
    }
  );
};
