var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/routes/api/jobRoutes.ts
import { Router } from 'express';
import { getUnpaidJobsSum } from '../../functions/job.js';
import { addJobToContract } from '../../functions/contractJobs.js';
const router = Router();
router.get('/unpaid-sum', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unpaidSum = yield getUnpaidJobsSum();
        res.status(200).json({ unpaidSum });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, name, description } = req.body;
    try {
        const newJob = yield addJobToContract(contractId, { name, description });
        res.status(201).json(newJob);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
export default router;
