import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import winston from 'winston';
import dotenv from 'dotenv';
import db from './db.js'; // Importar a conexão com o MySQL do arquivo db.ts
import { DataTypes } from 'sequelize';

// Carregar variáveis de ambiente
dotenv.config();

// Inicializando o servidor
const app = express();
const port = process.env.PORT || 3000;

// Configurações do servidor
app.use(express.json());

// Modelos Sequelize (Usuários)
const User = db.define('User', {
  username: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING }, // cliente, operador, administrador
  isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
  failedAttempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 }
});

// Middleware para verificar token JWT
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Criação de usuário (registrar)
app.post('/register', async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  // Criptografar senha
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar usuário' });
  }
});

// Login e geração de token JWT
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
  const token = jwt.sign({ username: user.getDataValue('username'), role: user.getDataValue('role') }, process.env.JWT_SECRET || 'secret_key');
  res.json({ token });
});

// Inicializar banco de dados e servidor
db.sync({ force: true }).then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
});
