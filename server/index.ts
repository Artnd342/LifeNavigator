import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;
const JWT_SECRET = 'lifenavigator_secret';

app.use(cors());
app.use(express.json());

// Extend the Request type to include `user`
interface AuthRequest extends Request {
  user?: { userId: number };
}

// 🔒 JWT Authentication Middleware
const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// 🔐 Register
app.post('/api/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { username, password: hashedPassword } });

    res.status(201).json({ message: 'User created successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔐 Login
app.post('/api/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// 📥 Add Task
app.post('/api/tasks', authenticate, async (req: AuthRequest, res: Response) => {
  const { title, estimated_time } = req.body;
  const userId = req.user!.userId;

  try {
    await prisma.task.create({
      data: {
        title,
        estimated_time,
        completed: false,
        userId,
      },
    });
    res.status(201).json({ message: 'Task added' });
  } catch {
    res.status(500).json({ message: 'Error creating task' });
  }
});

// 📤 Get Tasks
app.get('/api/tasks', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    const tasks = await prisma.task.findMany({ where: { userId } });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// ✏️ Edit Task
app.put('/api/tasks/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, estimated_time, completed } = req.body;
  const userId = req.user!.userId;

  try {
    const task = await prisma.task.updateMany({
      where: { id: Number(id), userId },
      data: { title, estimated_time, completed },
    });

    if (task.count === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task updated' });
  } catch {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// ❌ Delete Task
app.delete('/api/tasks/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  try {
    const task = await prisma.task.deleteMany({
      where: { id: Number(id), userId },
    });

    if (task.count === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// 🤖 AI Suggestions (Rule-Based)
app.post('/api/ai/suggest', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    const tasks = await prisma.task.findMany({
      where: { userId, completed: false },
      orderBy: { estimated_time: 'asc' },
    });

    res.json({ suggestions: tasks });
  } catch {
    res.status(500).json({ message: 'Error generating suggestions' });
  }
});

// 🔄 Health check
app.get('/', (_req, res) => {
  res.send('✅ LifeNavigator backend running');
});

// 🔥 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

