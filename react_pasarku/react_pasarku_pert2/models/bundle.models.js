const Sequelize = require('sequelize');
const dbConfig = require('../config/config')

const sequelize = new Sequelize(
    dbConfig.DBNAME,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorAliases: false,
        port: dbConfig.DBPORT,
        pool:{
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.produk = require('./produk.model')(sequelize, Sequelize);
db.kategori = require('./kategori.model')(sequelize, Sequelize);

// set relasi
db.kategori.hasMany(db.produk, {foreignKey: 'category_id', onDelete: 'SET NULL'});
db.produk.belongsTo(db.kategori, {foreignKey: 'category_id', onDelete: 'SET NULL'})
// jika 1 data kategori dihapus, ia akan delete produk yg lain nya

module.exports = db;
