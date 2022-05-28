const db = require('../models/bundle.model');
const func = require('../libs/function');
const {v4: uuidv4} = require('uuid');

exports.create = async(req, res) =>{
    const data = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        full_description: req.body.full_description,
        price: req.body.price,
        image: req.file.filename,
        category_id: req.body.category_id,
        url: func.convertToSlug(req.body.title+" "+Math.random(1000))
    };

    console.log(req.file.filename);

    db.produk.create(data).then(result =>{
        res.send({
            code: 200,
            message: 'Berhasil menambahkan data',
            data: result
        });
    }).catch(err =>{
        res.status(500).send({
            code: 500,
            message: 'Gagal menambahkan data'
        });
    });
}

exports.findAll = async (req, res) =>{

    db.produk.findAll().then(result =>{
        if(result.length > 0){
            res.send({
                code: 200,
                message: 'Ok find all',
                data: result
            });
        }else{
            res.status(404).send({
                code: 404,
                message: 'Data tidak ada'
            });
        }
    }).catch(err =>{
        res.status(500).send({
            code: 500,
            message: 'Gagal find all'
        });
    });
}

exports.findOne = async(req, res) =>{
    const id = req.params.id;
    db.produk.findOne({where: {id: id}}).then(result =>{
        res.send({
            code: 200,
            message: 'Berhasil find one data',
            data: result
        });
    }).catch(err =>{
        res.status(500).send({
            code: 500,
            message: 'Gagal find one data'
        });
    });
}

exports.update = async (req, res) => {
    const id = req.params.id;
    const data = {
        title: req.body.title,
        description: req.body.description,
        full_description: req.body.full_description,
        price: req.body.price,
        category_id: req.body.category_id
    }

    if(req.file != undefined){
        data.image = req.file.filename;
    }

    db.produk.update(data, {
        where: {id: id}
    }).then(result =>{
        res.send({
            code: 200,
            message: 'Berhasil mengubah data',
            data: result
        });
    }).catch(err =>{
        res.status(500).send({
            code: 500,
            message: 'Gagal mengubah data'
        });
    });
}

exports.delete = async (req, res) => {
    const id = req.params.id;

    db.produk.destroy({
        where: {id: id}
    }).then(result =>{
        res.send({
            code: 200,
            message: 'OK',
        });
    }).catch(err =>{
        res.status(500).send({
            code: 500,
            message: 'Gagal delete data'
        });
    });
}