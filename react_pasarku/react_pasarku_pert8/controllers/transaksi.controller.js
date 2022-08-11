const db = require('../models/bundle.model');

exports.getAllTransaksi = (req, res) =>{
    db.transaksi.findAll({
        attributes: ['id', 'trs_number', 'createdAt'],
        include: [
            {
                model: db.transaksi_detail,
                attributes: ['id', 'qty'],
                include: [
                    {
                        attributes: ['id', 'title', 'image', 'price', 'url'],
                        model: db.produk,
                        include: [
                            {
                                model: db.kategori,
                                attributes: ['name'],
                            }
                        ],
                    }
                ],
            }
        ]
    }).then(async result =>{
        if(result.length > 0){
            const dataTransaksi = await result.map((item, index) => {
                
                const detailItem = item.transaksi_details.map((_item, _index) =>{
                    return{
                        id: _item.id,
                        produk_id: _item.produk_id,
                        title: _item.produk.title,
                        image: _item.produk.image,
                        price: _item.produk.price,
                        url: _item.produk.url,
                        qty: _item.qty,
                        kategori: _item.produk.kategori.name,
                    }
                });

                return{
                    id: item.id,
                    trs_number: item.trs_number,
                    details: detailItem,
                }
            });
            res.send({
                code: 200,
                message: 'OK',
                data: dataTransaksi
            });
        }else{
            res.status(404).send({
                code: 404,
                message: 'Belum ada transaksi',
            });
        }
    }).catch(err =>{
        res.status(500).send({
            code: 500,
            message: 'Error > '+err,
        });
    });
}

exports.getOneTransaksi = (req, res) => {
    const id = req.params.id;

    db.transaksi.findOne({
        where: {id: id},
        attributes: ['id', 'trs_number', 'createdAt'],
        include: [
            {
                model: db.transaksi_detail,
                attributes: ['id', 'qty'],
                include: [
                    {
                        model: db.produk,
                        attributes: ['id', 'title', 'image', 'price', 'url'],
                        include: [
                            {
                                model: db.kategori,
                                attributes: ['name'],
                            }
                        ],
                    }
                ],
            }
        ]
    }).then(async result =>{
        if(result.length !== null){
            const detailItem = result.transaksi_details.map((_item, _index) =>{
                return{
                    id: _item.id,
                    produk_id: _item.produk_id,
                    title: _item.produk.title,
                    image: _item.produk.image,
                    price: _item.produk.price,
                    url: _item.produk.url,
                    qty: _item.qty,
                    kategori: _item.produk.kategori.name,
                }
            });

            res.send({
                code: 200,
                message: 'OK',
                data: {
                    id: result.id,
                    trs_number: result.trs_number,
                    createdAt: result.createdAt,
                    details: detailItem,
                }
            });
        }else{
            res.status(404).send({
                code: 404,
                message: 'Transaksi tidak ditemukan',
            });
        }
    }).catch(err =>{
        res.status(500).send({
            code: 500,
            message: 'Error > '+err,
        });
    });
}

exports.updateStatusTranskasi = (req, res) =>{

}








/*
* GET ALL TRANSAKSI LANGSUNG RETURN RESULT HANYA PAKAI ATTRIBUTES (TANPA MAP)

{
    "id": "b31f2519-011c-438e-a4c5-4378ef410b84",
    "trs_number": "TRS-1654502898944",
    "createdAt": "2022-06-06T08:08:18.000Z",
    "transaksi_details": [
        {
            "id": 5,
            "qty": 5,
            "produk": {
                "id": "1b56c895-8f5a-4dc6-9bf9-0dc862e69cd3",
                "title": "tester",
                "image": "1653667347295_1 html to nextjs (1).png",
                "price": 20000,
                "url": "tester-00586274811407288",
                "kategori": {
                    "name": "hadiah"
                }
            }
        }
    ]
},

ketika diview = model.transaksi_details(item => item.produk.kategori.name)

* GET ALL TRANSAKSI PAKAI ATTRIBUTES + MAP BARU RETURN DATA TRANSAKSI

{
"id": "b31f2519-011c-438e-a4c5-4378ef410b84",
"trs_number": "TRS-1654502898944",
"details": [
        {
            "id": 5,
            "title": "tester",
            "image": "1653667347295_1 html to nextjs (1).png",
            "price": 20000,
            "url": "tester-00586274811407288",
            "qty": 5,
            "kategori": "hadiah"
        }
    ]
},

ketika diview = model.details(item => item.kategori)

*/