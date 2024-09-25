// db.ts
import { Sequelize } from 'sequelize';
const db = new Sequelize('bcfionode', 'root', 'supre123', {
    host: 'localhost',
    port: 3300,
    dialect: 'mysql',
    logging: false,
});
export default db;
