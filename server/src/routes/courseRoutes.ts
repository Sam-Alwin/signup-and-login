import express from "express";
import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Course from "../models/Course";
import { authenticateJWT } from "../middleware/authMiddleware"; 

const router = express.Router();


interface AuthRequest extends Request {
  user?: { id: number };
}


const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  authenticateJWT(req, res, () => {
    if (!req.user || !req.user.id) {
      res.status(403).json({ message: "Unauthorized: Invalid Token" });
    } else {
      next();
    }
  });
};


router.post("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, platform, category, status, rating } = req.body;
    const userId = req.user!.id;

    const course = await Course.create({
      title,
      platform,
      category,
      status,
      rating,
      user_id: userId,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const courses = await Course.findAndCountAll({
      where: {
        user_id: userId,
        status: { [Op.not]: "Deleted" },

        
        title: { [Op.like]: `%${req.query.search || ""}%` },
      },
      order: [[String(req.query.sort || "createdAt"), String(req.query.order || "DESC")]],
      limit: Number(req.query.limit) || 10,
      offset: ((Number(req.query.page) || 1) - 1) * (Number(req.query.limit) || 10),
    });

    res.json({ total: courses.count, courses: courses.rows });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.user_id !== userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await course.update(req.body);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.user_id !== userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    await course.update({ status: "Deleted" });

    res.json({ message: "Course marked as deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }

   
});

export default router;
