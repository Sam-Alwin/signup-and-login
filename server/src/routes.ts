import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import User from "./models/User"; 
import courseRoutes from "./routes/courseRoutes";  
import { closeDB } from "./db";

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "asdiacdininirrierinvi"; 


router.use("/courses", courseRoutes);  


router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    if (!password || typeof password !== "string") {
      res.status(400).json({ error: "Invalid password format" });
      return;
    }

    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email already available" });
      return;
    }

    
    const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    const newUser = await User.create({ username, email, password: encryptedPassword });

    res.json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    
    const decryptedPassword = CryptoJS.AES.decrypt(user.password, SECRET_KEY).toString(CryptoJS.enc.Utf8);

    
    if (password !== decryptedPassword) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

    res.json({ token, userId: user.id });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/user/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      res.status(401).json({ message: "Access Denied" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Invalid Token Format" });
      return;
    }

    
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number };

    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: ["id", "username", "email"], 
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Invalid Token" });
  }
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/forgot-password", async (req, res): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "15m" });
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/reset-password", async (req, res): Promise<void> => {
  try {
    const { password, token } = req.body;

    if (!token) {
      res.status(400).json({ error: "Invalid token" });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number };
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    await user.update({ password: encryptedPassword });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Invalid or expired token" });
  }
});


router.get("/close-db", (_req: Request, res: Response): void => {
  closeDB();
  res.json({ message: "Database connection closed" });
});

export default router;
