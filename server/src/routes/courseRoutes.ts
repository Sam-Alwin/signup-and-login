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

    if (!title || !platform || !category || !status) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

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
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const search = String(req.query.search || "").trim();
    const sort = String(req.query.sort || "createdAt").trim();
    const order = String(req.query.order || "DESC").toUpperCase();
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const validSortFields = ["title", "platform", "category", "rating", "createdAt", "updatedAt"];
    const sortField = validSortFields.includes(sort) ? sort : "createdAt";
    const sortOrder = order === "ASC" ? "ASC" : "DESC";

    const whereCondition: any = {
      user_id: userId,
      status: { [Op.not]: "Deleted" },
      [Op.or]: [
        { title: { [Op.like]: `%${search}%` } },
        { platform: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
      ],
    };

    if (req.query.status) {
      whereCondition.status = req.query.status;
    }

    if (req.query.rating) {
      whereCondition.rating = Number(req.query.rating);
    }

    const courses = await Course.findAndCountAll({
      where: whereCondition,
      order: [[sortField, sortOrder]],
      limit,
      offset,
    });

    res.json({ total: courses.count, courses: courses.rows });
  } catch (error) {
    console.error("Error fetching courses:", error);
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
    res.json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error("Error updating course:", error);
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
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/check-duplicate", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, platform, category } = req.body;
    const userId = req.user!.id;

    if (!title || !platform || !category) {
      res.status(400).json({ message: "Title, platform, and category are required" });
      return;
    }

    const existingCourse = await Course.findOne({
      where: {
        user_id: userId,
        title: { [Op.iLike]: title.trim() },
        platform: { [Op.iLike]: platform.trim() },
        category: { [Op.iLike]: category.trim() },
        status: { [Op.not]: "Deleted" },
      },
    });

    res.json({ isDuplicate: !!existingCourse });
  } catch (error) {
    console.error("Error checking duplicate course:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;