const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const db = require('./models/bundle.model');

// part 2 mendefinisikan folder public
app.use('/public', express.static('public'))

app.use(bodyParser.json());
// part 2
app.use(bodyParser.urlencoded({extended: false}));

// jalankan bundle models
db.sequelize.sync({force: false});

// jalankan routes
const productRouter = require('./routes/produk');
app.use('/produk', productRouter);
const kategoriRouter = require('./routes/kategori');
app.use('/kategori', kategoriRouter);

module.exports = app;
