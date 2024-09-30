import { Router } from 'express';
import { getProfileBalance } from '../../functions/profile.js';
import Profile from '../../models/profile.js'; 

const router = Router();

// Rota para verificar saldo
router.get('/:id/balance', async (req, res) => {
  const idParam = req.params.id;

  if (!idParam) {
    return res.status(400).json({ error: 'ID não fornecido' });
  }

  const profileId = parseInt(idParam, 10);

  if (isNaN(profileId)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const balance = await getProfileBalance(profileId);
    if (!balance) {
      return res.status(404).json({ message: 'Perfil não encontrado' });
    }
    res.status(200).json({ balance });
  } catch (error) {
    const errorMessage = (error as Error).message || 'Erro desconhecido';
    res.status(500).json({ error: errorMessage });
  }
});

// Rota para criar um novo perfil
router.post('/', async (req, res) => {
  try {
    const { balance } = req.body;

    // Cria um novo perfil com o saldo fornecido ou o padrão 0
    const newProfile = await Profile.create({
      balance: balance || 0,
    });

    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar perfil' });
  }
});

export default router;
