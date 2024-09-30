// src/routes/api/testRoutes.ts
import { Router } from 'express';
import Contract from '../../models/contract.js'

const router = Router();


router.post('/add-test-contract', async (req, res) => {
    try {
        const newContract = await Contract.create({
            
            name: 'Contrato de Teste',
            
        });
        res.status(201).json(newContract);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
