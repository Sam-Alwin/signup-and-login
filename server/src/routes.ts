import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import db, { closeDB } from "./db";
import CryptoJS from "crypto-js"; 

const router = express.Router();
const SECRET_KEY = "asdiacdininirrierinvi"; 

router.post("/register", async (req: Request, res: Response):Promise<any> => {
  try {
    const { username, email, password } = req.body;
    console.log("Called", username, email, password);

    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid password format" });
    }

    
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results:[]) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "Email already available" });
      }

      
      const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
      console.log("Encrypted Password:", encryptedPassword);

      db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, encryptedPassword],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "User registered successfully" });
        }
      );
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const users = results as RowDataPacket[];
    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    const user = users[0];

    
    const decryptedPassword = CryptoJS.AES.decrypt(user.password, SECRET_KEY).toString(CryptoJS.enc.Utf8);

    
    if (password !== decryptedPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, "12345");
    res.json({ token, userId: user.id });
  });
});


router.get("/user/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const authHeader = req.header("Authorization");

    if (!authHeader) return res.status(401).json({ message: "Access Denied" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid Token Format" });

    
    const decoded = await new Promise<{ id: string }>((resolve, reject) => {
      jwt.verify(token, "12345", (err, decoded) => {
        if (err) reject(new Error("Invalid Token"));
        else resolve(decoded as { id: string });
      });
    });

    const userId = parseInt(id, 10);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid User ID" });

    // Fetch User Data from MySQL
    const user = await new Promise<RowDataPacket[]>((resolve, reject) => {
      db.query("SELECT id, username, email FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) reject(new Error(err.message));
        else resolve(results as RowDataPacket[]);
      });
    });

    if (user.length === 0) return res.status(404).json({ message: "User not found" });

    return res.json(user[0]);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});


router.get("/close-db", (_req: Request, res: Response) => {
  closeDB();
  res.json({ message: "Database connection closed" });
});

export default router;
