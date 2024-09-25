import { Model, DataTypes } from 'sequelize';
import db from '../db';
class Contract extends Model {
}
Contract.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ProfileId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Profile',
            key: 'id',
        },
    },
}, {
    sequelize: db,
    modelName: 'Contract',
});
export default Contract;
