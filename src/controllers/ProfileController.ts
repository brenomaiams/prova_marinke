import Profile from '../models/profile';
import Contract from '../models/contract';
import Job from '../models/job';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize';

class ProfileController {
  async getBalance(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const profile = await Profile.findByPk(id);
      if (!profile) {
        return res.status(404).json({ message: 'Perfil não encontrado' });
      }
      return res.json({ balance: profile.balance });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar saldo', error });
    }
  }

  async getUnpaidJobs(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const contract = await Contract.findOne({ where: { ProfileId: id } });
      if (!contract) {
        return res.status(404).json({ message: 'Contrato não encontrado' });
      }
      const jobs = await Job.findAll({
        where: { ContractId: contract.id, paid: false },
      });
      const total = jobs.reduce((acc, job) => acc + job.price, 0);
      return res.json({ total, jobs });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar trabalhos', error });
    }
  }

  async deposit(req: Request, res: Response) {
    const { id } = req.params;
    const { value } = req.body;

    if (value <= 0) {
      return res.status(400).json({ message: 'Valor inválido. O valor deve ser maior que zero.' });
    }

    const transaction: Transaction = await Profile.sequelize.transaction();
    try {
      const profile = await Profile.findByPk(id, { lock: transaction.LOCK.UPDATE });
      if (!profile) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Perfil não encontrado' });
      }

      profile.balance += value;
      await profile.save({ transaction });
      await transaction.commit();
      return res.json({ message: 'Depósito realizado com sucesso', balance: profile.balance });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({ message: 'Erro ao realizar depósito', error });
    }
  }

  async getJobs(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const contract = await Contract.findOne({ where: { ProfileId: id } });
      if (!contract) {
        return res.status(404).json({ message: 'Contrato não encontrado' });
      }
      const jobs = await Job.findAll({ where: { ContractId: contract.id } });
      return res.json(jobs);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar trabalhos', error });
    }
  }

  async createProfile(req: Request, res: Response) {
    const { balance } = req.body;
    if (balance === undefined || balance < 0) {
      return res.status(400).json({ message: 'Saldo inicial inválido' });
    }

    try {
      const profile = await Profile.create({ balance });
      return res.status(201).json(profile);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar perfil', error });
    }
  }
}

export default ProfileController;