var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/routes/api/depositRoutes.ts
import { Router } from 'express';
import { makeDeposit } from '../../functions/deposit.js';
const router = Router();
// Rota para realizar um depósito
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profileId, amount } = req.body;
    try {
        const newBalance = yield makeDeposit(profileId, amount);
        res.status(200).json({ message: 'Depósito realizado com sucesso!', newBalance });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
export default router;
