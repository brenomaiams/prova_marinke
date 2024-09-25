import Contract from '../models/contract';
import Profile from '../models/profile';
import Job from '../models/job';
import { Request, Response } from 'express';

class ContractController {
  async getJobs(req: Request, res: Response) {
    const { id } = req.params;
    const contract = await Contract.findByPk(id);
    if (!contract) {
      return res.status(404).json({ message: 'Contrato não encontrado' });
    }
    const jobs = await Job.findAll({
      where: { ContractId: contract.id },
    });
    return res.json(jobs);
  }
}

export default ContractController;