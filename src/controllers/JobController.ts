// controllers/JobController.ts
import Job from '../models/job';
import Contract from '../models/contract';
import { Request, Response } from 'express';

class JobController {
  async getJobs(req: Request, res: Response) {
    const { id } = req.params;
    const contract = await Contract.findOne({
      where: { ProfileId: id },
    });
    if (!contract) {
      return res.status(404).json({ message: 'Contrato não encontrado' });
    }
    const jobs = await Job.findAll({
      where: { ContractId: contract.id },
    });
    return res.json(jobs);
  }
}

export default JobController;