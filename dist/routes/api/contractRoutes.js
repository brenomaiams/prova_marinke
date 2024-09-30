var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/routes/api/contractRoutes.ts
import { Router } from 'express';
import { getContractById } from '../../functions/contractFunctions.js';
const router = Router();
// Rota para buscar um contrato pelo ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contractId = parseInt(req.params.id, 10);
    try {
        const contract = yield getContractById(contractId);
        res.status(200).json(contract);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
}));
export default router;
