var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Profile from '../models/profile';
import Contract from '../models/contract';
import Job from '../models/job';
class ProfileController {
    getBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const profile = yield Profile.findByPk(id);
            if (!profile) {
                return res.status(404).json({ message: 'Perfil não encontrado' });
            }
            return res.json({ balance: profile.balance });
        });
    }
    getUnpaidJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobs = yield Job.findAll({
                where: { paid: false },
            });
            const total = jobs.reduce((acc, job) => acc + job.price, 0);
            return res.json({ total });
        });
    }
    deposit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { value } = req.body;
            if (value < 0) {
                return res.status(400).json({ message: 'Valor inválido' });
            }
            const profile = yield Profile.findByPk(id);
            if (!profile) {
                return res.status(404).json({ message: 'Perfil não encontrado' });
            }
            profile.balance += value;
            yield profile.save();
            return res.json({ message: 'Depósito realizado com sucesso' });
        });
    }
    getJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const contract = yield Contract.findOne({
                where: { ProfileId: id },
            });
            if (!contract) {
                return res.status(404).json({ message: 'Contrato não encontrado' });
            }
            const jobs = yield Job.findAll({
                where: { ContractId: contract.id },
            });
            return res.json(jobs);
        });
    }
    createProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { balance } = req.body;
            const profile = yield Profile.create({ balance });
            return res.json(profile);
        });
    }
}
export default ProfileController;
