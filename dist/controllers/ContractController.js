var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Contract from '../models/contract';
import Job from '../models/job';
class ContractController {
    getJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const contract = yield Contract.findByPk(id);
            if (!contract) {
                return res.status(404).json({ message: 'Contrato não encontrado' });
            }
            const jobs = yield Job.findAll({
                where: { ContractId: contract.id },
            });
            return res.json(jobs);
        });
    }
}
export default ContractController;
