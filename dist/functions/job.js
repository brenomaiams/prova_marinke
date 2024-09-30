var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/functions/job.js
import Job from '../models/job.js';
// Função para retornar a soma dos Jobs não pagos
export const getUnpaidJobsSum = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unpaidSum = yield Job.sum('price', { where: { paid: false } });
        return unpaidSum || 0; // Retorna 0 se não houver Jobs não pagos
    }
    catch (error) {
        throw new Error('Erro ao obter a soma dos Jobs não pagos');
    }
});
