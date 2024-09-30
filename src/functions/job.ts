// src/functions/job.js
import Job from '../models/job.js';

// Função para retornar a soma dos Jobs não pagos
export const getUnpaidJobsSum = async () => {
try {
    const unpaidSum = await Job.sum('price', { where: { paid: false } });
    return unpaidSum || 0; // Retorna 0 se não houver Jobs não pagos
} catch (error) {
    throw new Error('Erro ao obter a soma dos Jobs não pagos');
}
};
