import express, { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Course from '../models/Course';
import authenticateJWT from '../middleware/authMiddleware';

const router = express.Router();

interface AuthRequest extends Request {
  user: { id: number };
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  authenticateJWT(req, res, () => {
    next();
  });
};

// Create a course
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, platform, category, status, rating } = req.body;
    const { user } = req as AuthRequest; // Type assertion to ensure `user` exists

    const course = await Course.create({
      title, 
      platform, 
      category, 
      status, 
      rating, 
      user_id: user.id
    });
    
    

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Fetch courses (pagination, search, sorting, filtering)
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', search = '', sort = 'createdAt', order = 'DESC' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const { user } = req as AuthRequest;

    const courses = await Course.findAndCountAll({
      where: {
        user_id: user.id,
        title: { [Op.like]: `%${search}%` }, // Search courses by title
      },
      order: [[String(sort), String(order)]],
      limit: Number(limit),
      offset,
    });

    res.json({ total: courses.count, courses: courses.rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update a course
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { user } = req as AuthRequest;

    const course = await Course.findByPk(req.params.id);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    if (course.user_id !== user.id) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    await course.update(req.body);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Soft delete a course
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { user } = req as AuthRequest;

    const course = await Course.findByPk(req.params.id);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    if (course.user_id !== user.id) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    await course.destroy(); // Soft delete
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
