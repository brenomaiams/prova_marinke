import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from './db.js'; 
import profileRoutes from './routes/api/profileRoutes.js'; 
import jobRoutes from './routes/api/jobRoutes.js';
import Contract from './models/contract.js'; 
import Job from './models/job.js';
import { DataTypes } from 'sequelize';
import depositRoutes from './routes/api/depositRoutes.js';
import contractJobRoutes from './routes/api/contractJobRoutes.js';
import contractRoutes from './routes/api/contractRoutes.js';
import testRoutes from './routes/api/testRoutes.js';




dotenv.config();


const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());


const User = db.define('User', {
  username: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING }, 
  isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
  failedAttempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 },
});


function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


app.post('/register', async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar usuário' });
  }
});


app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  if (user.getDataValue('isBlocked')) {
    return res.status(403).json({ message: 'Usuário bloqueado' });
  }

  const match = await bcrypt.compare(password, user.getDataValue('password'));
  if (!match) {
    await user.update({ failedAttempts: user.getDataValue('failedAttempts') + 1 });
    if (user.getDataValue('failedAttempts') >= 3) {
      await user.update({ isBlocked: true });
      return res.status(403).json({ message: 'Usuário bloqueado após múltiplas tentativas' });
    }
    return res.status(400).json({ message: 'Credenciais inválidas' });
  }

  await user.update({ failedAttempts: 0 });
  const token = jwt.sign(
    { username: user.getDataValue('username'), role: user.getDataValue('role') },
    process.env.JWT_SECRET || 'secret_key'
  );
  res.json({ token });
});




// ROTAS!!!!!!!!!!
app.use('/api/profiles', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/contracts', contractJobRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/test', testRoutes);







app._router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});

// Inicializar banco de dados e servidor
db.sync() 
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((err: any) => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });
