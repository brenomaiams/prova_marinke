// src/models/contract.ts
import { Model, DataTypes } from 'sequelize';
import db from '../db.js';

class Contract extends Model {
  public id!: number;
  public details!: string;
}

Contract.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  details: {
    type: DataTypes.STRING,
  },
}, {
  sequelize: db,
  modelName: 'Contract',
});

export default Contract;
