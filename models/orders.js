const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Orders extends Model {}
Orders.init(
  {
    side: DataTypes.STRING,
    price:  DataTypes.FLOAT,
  },
  { modelName: 'orders', sequelize }
);

module.exports = { Orders };
