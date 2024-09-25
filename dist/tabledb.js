import express from 'express';
import db from './db';
import router from './routes';
const app = express();
app.use(express.json());
app.use(router);
db.sync()
    .then(() => {
    console.log('Tabelas criadas com sucesso!');
    app.listen(3000, () => {
        console.log('Servidor iniciado na porta 3000!');
    });
})
    .catch((error) => {
    console.error('Erro ao criar tabelas:', error);
});
