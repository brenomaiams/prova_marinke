var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/functions/deposit.ts
import Profile from '../models/profile.js';
export const makeDeposit = (profileId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar se o valor do depósito é negativo
    if (amount < 0) {
        throw new Error('Não é possível realizar depósitos com valores negativos.');
    }
    const profile = yield Profile.findByPk(profileId);
    if (!profile) {
        throw new Error('Perfil não encontrado.');
    }
    // Atualizar o saldo do perfil
    profile.balance += amount;
    yield profile.save();
    return profile.balance;
});
