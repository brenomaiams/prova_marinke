// src/routes/api/contractRoutes.ts
import { Router } from 'express';
import { getContractById } from '../../functions/contractFunctions.js';

const router = Router();

// Rota para buscar um contrato pelo ID
router.get('/:id', async (req, res) => {
    const contractId = parseInt(req.params.id, 10);
    try {
        const contract = await getContractById(contractId); 
        res.status(200).json(contract); 
    } catch (error) {
        res.status(404).json({ error: (error as Error).message });
    }
});

export default router;
