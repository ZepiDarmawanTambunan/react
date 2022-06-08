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
    const cekKeranjang = await db.keranjang.findOne({
        where: [
            {
                produk_id : req.body.produk_id,
            },
            {
                session_id: req.body.session_id,
            }
        ]
    });

    // JIKA PRODUK YG AKAN DITAMBAH KERANJANG SUDAH ADA
    
    if(cekKeranjang !== null){
        
        const data = {
            qty: cekKeranjang.qty + 1,
        }

        db.keranjang.update(data, {
            where: {id: cekKeranjang.id}
        }).then(result =>{
            res.send({
                code: 200,
                message: 'Berhasil menambahkan keranjang',
            })
        }).catch(err =>{
            res.status(500).send({
                code: 500,
                message: 'Error >', err
            });
        });

    }
    // JIKA PRODUK YG AKAN DITAMBAH KERANJANG BELUM ADA (DEFAULT)
    else{
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
    }
}
    
    exports.ubahDataKeranjang = async(req, res) =>{
        const id = req.params.id;
        const qty = req.body.qty;
    
        db.keranjang.update({qty: qty}, {
            where: {id: id}
        }).then(result => {
            if(result[0]){
                res.send({
                    code: 200,
                    message: 'Berhasil ubah data'
                })
            }else{
                res.status(422).send({
                    code: 422,
                    message: 'Input invalid',
                });
            }
        }).catch(err =>{
            res.status(500).send({
                code: 500,
                message: 'ERROR ubah data >', err
            });
        });
    }


exports.hapusDataKeranjang = async(req, res) =>{
    const id = req.params.id;

    db.keranjang.destroy({where: {id: id}})
    .then(result =>{
        res.send({
            code: 200,
            message: 'Berhasil hapus data'
        });
    })
    .catch(err =>{
        res.status(500).send({
            code: 500,
            message: 'Error hapus data >', err
        });
    });
}

exports.checkout = async(req, res) =>{
    const session_id = req.query.session_id;

    const data = {
        email : req.body.email,
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        alamat : req.body.alamat,
        phone : req.body.phone,
    }

    const dataKeranjang = await db.keranjang.findAll({
        where: {session_id: session_id}
    });

    console.log(dataKeranjang.length);

    if(dataKeranjang.length > 0){
        const trs_number = 'TRS-'+Date.now();
        const trs_id = uuidv4();

        const dataTransaksi = {
            id: trs_id,
            trs_number: trs_number,
        };

        await db.transaksi.create(dataTransaksi);

        await dataKeranjang.map((item, index) =>{
            const dataTrsDetail = {
                qty: item.qty,
                produk_id: item.produk_id,
                trs_id: trs_id
            }

            db.transaksi_detail.create(dataTrsDetail);
            db.keranjang.destroy({where: {id: item.id}});
        });

        await db.customer.create(data);

        await res.status(200).send({
            code: 200,
            message: 'Berhasil melakukan transaksi'
        });

    }else{

    }
}
