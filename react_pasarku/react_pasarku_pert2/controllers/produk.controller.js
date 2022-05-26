const {v4: uuidv4} = require('uuid');

// part2
exports.create = async(req, res) =>{
    const data = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        full_description: req.body.full_description,
        price: req.body.price,
        image: req.file.filename,
        category_id: req.body.category_id
    };

    console.log(`DATA =>> ${data}`);

    res.send({
        message: 'OK'
    });
}

exports.findAll = async (req, res) =>{
    res.send({
        message: 'OK FIND ALL'
    });
}