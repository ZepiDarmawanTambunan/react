const db = require('../models/bundle.model');

exports.create = async(req, res) =>{
    const data = {
        name: req.body.name,
    }

    db.kategori.create(data).then(result => {
        res.send({
            code: 200,
            message: 'Berhasil menyimpan data',
            data: result
        })
    }).catch(err => {
        res.status(500).send({
            code: 500,
            message: 'Gagal menyimpan data'
        });
    })
}

exports.findAll = async (req, res) =>{
    db.kategori.findAll().then(result =>{
        if(result.length > 0){
            res.send({
                code: 200,
                message: 'OK',
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
            message: 'Gagal ambil data'
        });
    });
}

exports.update = async (req, res) =>{
    const id = req.params.id;

    const data = {
        name: req.body.name
    }

    db.kategori.update(data, {
            where: {id: id},
        }).then(result =>{
            if(result[0]){
                res.send({
                    code: 200,
                    message: 'OK',
                    data: result
                });
            }else{
                res.status(422).send({
                    code: 422,
                    message: 'Gagal update data, field error',
                });
            }
        }).catch(err =>{
            res.status(500).send({
                code: 500,
                message: 'Gagal update data'
            });
        });
}

exports.delete = async(req, res) =>{
    const id = req.params.id;

    db.kategori.destroy({
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
