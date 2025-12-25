import { DataTypes, Model, Sequelize } from "sequelize";


export class User extends Model {}

export const initUserModel = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
            },
            role: {
                type: DataTypes.STRING
            }
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'User',
            freezeTableName: true
        }
    )
};

