module.exports = (sequelize, Sequelize) =>{
    const Keranjang = sequelize.define('keranjang', {
        qty: {
            type: Sequelize.INTEGER
        },
        session_id: {
            type: Sequelize.STRING,
        },       
    });
    return Keranjang;
}

// by default udah ada id, cuma kita tes buat aja
// foreign key product_id gak kita buat disini tapi di config.js