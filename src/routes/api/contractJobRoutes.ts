// src/routes/api/contractJobRoutes.ts
import { Router } from 'express';
import { getJobsByContractId } from '../../functions/contractJobs.js'; 
const router = Router();


router.get('/:contractId/jobs', async (req, res) => {
    const contractId = parseInt(req.params.contractId, 10);
    try {
        const jobs = await getJobsByContractId(contractId);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(404).json({ error: (error as Error).message });
    }
});

export default router;
