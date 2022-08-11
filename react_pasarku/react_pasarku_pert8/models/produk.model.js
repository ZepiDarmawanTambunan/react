module.exports = (sequelize, Sequelize) =>{
    const Produk = sequelize.define('produk', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        },
        full_description: {
            type: Sequelize.TEXT,
        },
        image: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.INTEGER
        },
        url: {
            type: Sequelize.STRING,
        },       
    });
    return Produk;
}

// by default udah ada id, cuma kita tes buat aja
// foreign key kategori_id gak kita buat disini tapi di config.js