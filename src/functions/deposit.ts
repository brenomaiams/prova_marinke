// src/functions/deposit.ts
import Profile from '../models/profile.js';


export const makeDeposit = async (profileId: number, amount: number): Promise<number> => {
    // Verificar se o valor do depósito é negativo
    if (amount < 0) {
        throw new Error('Não é possível realizar depósitos com valores negativos.');
    }

    
    const profile = await Profile.findByPk(profileId);
    if (!profile) {
        throw new Error('Perfil não encontrado.');
    }

    // Atualizar o saldo do perfil
    profile.balance += amount; 
    await profile.save();

    return profile.balance;
};
