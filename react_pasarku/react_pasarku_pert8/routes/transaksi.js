const express = require('express');
const router = express.Router();
const transaksi = require('../controllers/transaksi.controller');

router.get('/', transaksi.getAllTransaksi);
router.get('/:id', transaksi.getOneTransaksi);
router.put('/:id', transaksi.updateStatusTranskasi);

module.exports = router;