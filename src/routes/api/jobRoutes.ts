// src/routes/api/jobRoutes.ts
import { Router } from 'express';
import { getUnpaidJobsSum } from '../../functions/job.js';
import { addJobToContract } from '../../functions/contractJobs.js'; 

const router = Router();


router.get('/unpaid-sum', async (req, res) => {
    try {
        const unpaidSum = await getUnpaidJobsSum();
        res.status(200).json({ unpaidSum });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


router.post('/', async (req, res) => {
    const { contractId, name, description } = req.body;

    try {
        const newJob = await addJobToContract(contractId, { name, description });
        res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default router;
