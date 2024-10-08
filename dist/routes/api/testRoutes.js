var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/routes/api/testRoutes.ts
import { Router } from 'express';
import Contract from '../../models/contract.js';
const router = Router();
router.post('/add-test-contract', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newContract = yield Contract.create({
            name: 'Contrato de Teste',
        });
        res.status(201).json(newContract);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
export default router;
