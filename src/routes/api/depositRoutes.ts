// src/routes/api/depositRoutes.ts
import { Router } from 'express';
import { makeDeposit } from '../../functions/deposit.js';

const router = Router();

// Rota para realizar um depósito
router.post('/', async (req, res) => {
    const { profileId, amount } = req.body;

    try {
        const newBalance = await makeDeposit(profileId, amount);
        res.status(200).json({ message: 'Depósito realizado com sucesso!', newBalance });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default router;
