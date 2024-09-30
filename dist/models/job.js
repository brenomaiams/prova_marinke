import { Model, DataTypes } from 'sequelize';
import db from '../db.js';
import Contract from './contract.js';
class Job extends Model {
}
Job.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
    },
    paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    ContractId: {
        type: DataTypes.INTEGER,
        references: {
            model: Contract,
            key: 'id',
        },
    },
}, {
    sequelize: db,
    modelName: 'Job',
});
export default Job;
