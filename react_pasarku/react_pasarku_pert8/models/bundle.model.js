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
db.transaksi = require('./transaksi.model')(sequelize, Sequelize);
db.transaksi_detail = require('./transaksi-detail.model')(sequelize, Sequelize);
db.customer = require('./customer.model')(sequelize, Sequelize);
db.keranjang = require('./keranjang.model')(sequelize, Sequelize);

// set relasi
db.kategori.hasMany(db.produk, {foreignKey: 'category_id', onDelete: 'SET NULL'});
db.produk.belongsTo(db.kategori, {foreignKey: 'category_id', onDelete: 'SET NULL'})
// jika 1 data kategori dihapus, ia akan membuat category_id pada tabel produk = null agar tidak error

// DISINI KERANJANG HANYA BISA MENYIMPAN SATU JENIS PRODUK SAJA
db.produk.hasMany(db.keranjang, {foreignKey: 'produk_id', onDelete: 'CASCADE'});
db.keranjang.belongsTo(db.produk, {foreignKey: 'produk_id'});

// jika produk dihapus akan menghapus keranjang yg lain

db.produk.hasMany(db.transaksi_detail, {foreignKey: 'produk_id', onDelete: 'SET NULL'});
db.transaksi_detail.belongsTo(db.produk, {foreignKey: 'produk_id'});

db.transaksi.hasMany(db.transaksi_detail, {foreignKey: 'trs_id'});
db.transaksi_detail.belongsTo(db.transaksi, {foreignKey: 'trs_id'});

db.transaksi.hasOne(db.customer, {foreignKey: 'trs_id', onDelete: 'CASCADE'})
db.customer.belongsTo(db.transaksi, {foreignKey: 'trs_id'});

module.exports = db;