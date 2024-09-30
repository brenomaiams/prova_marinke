// db.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.DB_NAME || 'localhost2', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '123456789', {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,  
  dialect: 'mysql',
  logging: false,
});

// Teste de conexão
db.authenticate()
  .then(() => {
    console.log('Conexão estabelecida com sucesso.');
  })
  .catch((error: any) => {
    console.error('Não foi possível conectar ao banco de dados:', error);
  });

export default db;
