const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rapor = sequelize.define('Rapor', {
    Provesioning: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    avgMTTR: {
      type: DataTypes.TIME, // Gunakan DataTypes.DATE atau DataTypes.DATEONLY sesuai kebutuhan
      allowNull: false,
    },
    achievement: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return Rapor;
};
