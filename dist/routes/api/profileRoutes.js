var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { getProfileBalance } from '../../functions/profile.js';
import Profile from '../../models/profile.js';
const router = Router();
// Rota para verificar saldo
router.get('/:id/balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idParam = req.params.id;
    if (!idParam) {
        return res.status(400).json({ error: 'ID não fornecido' });
    }
    const profileId = parseInt(idParam, 10);
    if (isNaN(profileId)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    try {
        const balance = yield getProfileBalance(profileId);
        if (!balance) {
            return res.status(404).json({ message: 'Perfil não encontrado' });
        }
        res.status(200).json({ balance });
    }
    catch (error) {
        const errorMessage = error.message || 'Erro desconhecido';
        res.status(500).json({ error: errorMessage });
    }
}));
// Rota para criar um novo perfil
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { balance } = req.body;
        // Cria um novo perfil com o saldo fornecido ou o padrão 0
        const newProfile = yield Profile.create({
            balance: balance || 0,
        });
        res.status(201).json(newProfile);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar perfil' });
    }
}));
export default router;
