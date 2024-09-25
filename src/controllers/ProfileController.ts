import Profile from '../models/profile';
import Contract from '../models/contract';
import Job from '../models/job';
import { Request, Response} from 'express';

class ProfileController {
  async getBalance(req: Request, res: Response) {
    const { id } = req.params;
    const profile = await Profile.findByPk(id);
    if (!profile) {
      return res.status(404).json({ message: 'Perfil não encontrado' });
    }
    return res.json({ balance: profile.balance });
  }

  async getUnpaidJobs(req: Request, res: Response) {
    const jobs = await Job.findAll({
      where: { paid: false },
    });
    const total = jobs.reduce((acc, job) => acc + job.price, 0);
    return res.json({ total });
  }

  async deposit(req: Request, res: Response) {
    const { id } = req.params;
    const { value } = req.body;
    if (value < 0) {
      return res.status(400).json({ message: 'Valor inválido' });
    }
    const profile = await Profile.findByPk(id);
    if (!profile) {
      return res.status(404).json({ message: 'Perfil não encontrado' });
    }
    profile.balance += value;
    await profile.save();
    return res.json({ message: 'Depósito realizado com sucesso' });
  }

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

  async createProfile(req: Request, res: Response) {
    const { balance } = req.body;
    const profile = await Profile.create({ balance });
    return res.json(profile);
  }
}

export default ProfileController;