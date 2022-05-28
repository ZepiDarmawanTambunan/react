const express = require('express');
const router = express.Router();
const kategori = require('../controllers/kategori.controller');

router.get('/', kategori.findAll);
router.get('/:id', kategori.findOne);
router.post('/', kategori.create);
router.put('/:id', kategori.update);
router.delete('/:id', kategori.delete);

module.exports = router;
