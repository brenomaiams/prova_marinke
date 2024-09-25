import { Model, DataTypes } from 'sequelize';
import db from '../db';
class Profile extends Model {
}
Profile.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
}, {
    sequelize: db,
    modelName: 'Profile',
});
export default Profile;
