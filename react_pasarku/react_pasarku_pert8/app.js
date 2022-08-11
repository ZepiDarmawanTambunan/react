const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const db = require('./models/bundle.model');

// definisikan penyimpanan upload data
app.use('/public', express.static('public'))

// menerima request api berupa json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// jalankan bundle models
db.sequelize.sync({force: false});

// jalankan routes
const productRouter = require('./routes/produk');
app.use('/produk', productRouter);
const kategoriRouter = require('./routes/kategori');
app.use('/kategori', kategoriRouter);
const frontendRouter = require('./routes/frontend');
app.use('/frontend', frontendRouter);
const transaksiRouter = require('./routes/transaksi');
app.use('/transaksi', transaksiRouter);

module.exports = app;