const db = require('../models/bundle.model');
const Op = db.Sequelize.Op;
const func = require('../libs/function');
const {v4: uuidv4} = require('uuid');

// klo produkcontroller = rancangan dasar, didalamnya hanya ada produk saja
// frontendcontroller = rancangan yg lbih spesifik, didalamnya bisa ada produk dan kategori sekaligus

exports.getProdukHome = async(req, res) =>{
    db.produk.findAll({
        attributes: ['id', 'title', 'image', 'price', 'url'],   // hanya ambil data id, title.. saja
        limit: 8    // hanya ambil 8 data saja
    }).then(result =>{
        if(result.length > 0){
            res.send({
                code: 200,
                message: 'OK',
                data: result
            });
        }else{
            res.status(404).send({
                code: 404,
                message: 'Data tidak tersedia',
            });
        }
    }).catch(err =>{
        res.status(500).send({
            code: 500,
            message: 'Error find data > '+err
        });
    });
}

// handle search produk
exports.getProdukPage = async(req, res) =>{
    let keyword = '';

    const condition = [];
    if(req.query.keyword){
        keyword = req.query.keyword;
        condition.push({title: {[Op.like]: '%' + keyword + '%'}});
    }

    db.produk.findAll({
        where: condition,
        attributes: ['id', 'title', 'image', 'price', 'url'],
    }).then(result => {

        if(result.length > 0){
            res.send({
                code: 200,
                message: 'OK',
                data: result
            });
        }else{
            res.status(404).send({
                code: 404,
                message: 'Data tidak ditemukan',
            });
        }
    }).catch(err => {
        res.status(500).send({
            code: 500,
            message: 'Error find data > '+err
        });
    });
}

exports.getProdukDetail = async(req, res) =>{
    const url = req.params.url;

    db.produk.findOne({
        where: {url: url},
        attributes: ['id', 'title', 'description', 'full_description', 'price', 'image', 'url', 'createdAt'],
        include: [
            {
                // ambil data kategorinya juga
                model: db.kategori,
                attributes: ['name']
            }
        ]
    }).then(result =>{
        if(result){
            res.send({
                code: 200,
                message: 'OK',
                data: result
            });
        }else{
            res.status(404).send({
                code: 404,
                message: 'Data tidak ditemukan',
            });
        }
    }).catch(err =>{
        res.status(500).send({
            code: 500,
            message: 'Gagal'
        });
    });
}

exports.getDataKeranjang = async(req, res) =>{
    const session_id = req.query.session_id;
    
    db.keranjang.findAll({
        where: {session_id: session_id},
        attributes: ["id", "qty", "session_id", "createdAt"],
        include: [
            {
                model: db.produk,
                attributes: ["id", "title", "image", "price", "url"]
            }
        ]
    }).then(result =>{
        if(result.length > 0){
            res.send({
                code: 200,
                message: 'OK',
                data: result
            });
        }else{
            res.status(404).send({
                code: 404,
                message: 'Belum ada data dikeranjang'
            });
        }
    }).catch(err =>{
        res.status(500).send({
            code: 500,
            message: 'ERROR GET DATA'
        });
    });
}

exports.tambahDataKeranjang = async(req, res) =>{
    const data = {
        produk_id : req.body.produk_id,
        qty: req.body.qty,
        session_id: req.body.session_id
    }

    db.keranjang.create(data)
    .then(result =>{
        res.send({
            code: 200,
            message: 'Berhasil menambahkan data ke keranjang',
            data: result
        });
    }).catch(err =>{
        res.status(500).send({
            code: 500,
            message: 'ERROR POST DATA'
        });
    });
};

exports.ubahDataKeranjang = async(req, res) =>{

}

exports.hapusDataKeranjang = async(req, res) =>{

}

exports.checkout = async(req, res) =>{

}
