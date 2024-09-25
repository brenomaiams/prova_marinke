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
import winston from 'winston';
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
// Carregar variáveis de ambiente
dotenv.config();
// Inicializando o servidor
const app = express();
const port = process.env.PORT || 3000;
// Configurações do servidor
app.use(express.json());
// Configuração do Sequelize (usando SQLite)
const sequelize = new Sequelize('sqlite::memory:');
// Logger (usando Winston)
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
// Modelos Sequelize (Usuários)
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING }, // cliente, operador, administrador
    isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
    failedAttempts: { type: DataTypes.INTEGER, defaultValue: 0 },
    balance: { type: DataTypes.FLOAT, defaultValue: 0 }
});
// Middleware para verificar token JWT
function authenticateToken(req, res, next) {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user; // Aqui definimos req.user
        next();
    });
}
// Criação de usuário (registrar)
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    // Criptografar senha
    const hashedPassword = yield bcrypt.hash(password, 10);
    try {
        const user = yield User.create({ username, password: hashedPassword, role });
        logger.info(`Novo usuário criado: ${username}`);
        res.status(201).json({ message: 'Usuário criado com sucesso' });
    }
    catch (error) {
        logger.error(error);
        res.status(400).json({ message: 'Erro ao criar usuário' });
    }
}));
// Login e geração de token JWT
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User.findOne({ where: { username } });
    if (!user)
        return res.status(404).json({ message: 'Usuário não encontrado' });
    // Verificar se o usuário está bloqueado
    if (user.getDataValue('isBlocked')) {
        return res.status(403).json({ message: 'Usuário bloqueado' });
    }
    // Verificar a senha
    const match = yield bcrypt.compare(password, user.getDataValue('password'));
    if (!match) {
        // Incrementar tentativas falhas
        yield user.update({ failedAttempts: user.getDataValue('failedAttempts') + 1 });
        if (user.getDataValue('failedAttempts') >= 3) {
            yield user.update({ isBlocked: true });
            logger.info(`Usuário bloqueado: ${username}`);
            return res.status(403).json({ message: 'Usuário bloqueado após múltiplas tentativas' });
        }
        return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    // Resetar tentativas falhas e gerar token JWT
    yield user.update({ failedAttempts: 0 });
    const token = jwt.sign({ username: user.getDataValue('username'), role: user.getDataValue('role') }, process.env.JWT_SECRET || 'secret_key');
    logger.info(`Usuário autenticado: ${username}`);
    res.json({ token });
}));
// Rota para obter o saldo do usuário autenticado
app.get('/balance', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }
    const user = yield User.findOne({ where: { username: req.user.username } });
    if (!user)
        return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json({ balance: user.getDataValue('balance') });
}));
// Depósito na conta do usuário autenticado
app.post('/deposit', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }
    const { value } = req.body;
    if (value < 0)
        return res.status(400).json({ message: 'Valor inválido' });
    const user = yield User.findOne({ where: { username: req.user.username } });
    if (!user)
        return res.status(404).json({ message: 'Usuário não encontrado' });
    yield user.update({ balance: user.getDataValue('balance') + value });
    logger.info(`Depósito realizado para usuário: ${req.user.username}`);
    res.json({ message: 'Depósito realizado com sucesso' });
}));
// Inicializar banco de dados e servidor
sequelize.sync({ force: true }).then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
});
