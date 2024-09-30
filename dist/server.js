var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from './db.js';
import profileRoutes from './routes/api/profileRoutes.js';
import jobRoutes from './routes/api/jobRoutes.js';
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
function authenticateToken(req, res, next) {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
}
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    const hashedPassword = yield bcrypt.hash(password, 10);
    try {
        const user = yield User.create({ username, password: hashedPassword, role });
        res.status(201).json({ message: 'Usuário criado com sucesso' });
    }
    catch (error) {
        res.status(400).json({ message: 'Erro ao criar usuário' });
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User.findOne({ where: { username } });
    if (!user)
        return res.status(404).json({ message: 'Usuário não encontrado' });
    if (user.getDataValue('isBlocked')) {
        return res.status(403).json({ message: 'Usuário bloqueado' });
    }
    const match = yield bcrypt.compare(password, user.getDataValue('password'));
    if (!match) {
        yield user.update({ failedAttempts: user.getDataValue('failedAttempts') + 1 });
        if (user.getDataValue('failedAttempts') >= 3) {
            yield user.update({ isBlocked: true });
            return res.status(403).json({ message: 'Usuário bloqueado após múltiplas tentativas' });
        }
        return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    yield user.update({ failedAttempts: 0 });
    const token = jwt.sign({ username: user.getDataValue('username'), role: user.getDataValue('role') }, process.env.JWT_SECRET || 'secret_key');
    res.json({ token });
}));
// ROTAS!!!!!!!!!!
app.use('/api/profiles', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/contracts', contractJobRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/test', testRoutes);
app._router.stack.forEach((r) => {
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
    .catch((err) => {
    console.error('Erro ao sincronizar o banco de dados:', err);
});
