import { Model, DataTypes } from 'sequelize';
import db from '../db.js';
import Contract from './contract.js';
class Job extends Model {
  public id!: number;
  public price!: number;
  public paid!: boolean;
  public ContractId!: number;
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
