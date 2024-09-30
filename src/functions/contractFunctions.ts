// src/functions/contractFunctions.js
import Contract from '../models/contract.js';


export const getContractById = async (contractId: number): Promise<Contract | null> => {
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
        throw new Error('Contrato não encontrado.');
    }
    return contract;
};
