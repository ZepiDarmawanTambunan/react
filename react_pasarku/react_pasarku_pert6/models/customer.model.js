module.exports = (sequelize, Sequelize) =>{
    const Customer = sequelize.define('customer', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING,
        },
        first_name: {
            type: Sequelize.STRING,
        },
        last_name: {
            type: Sequelize.STRING,
        },
        alamat: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },     
    });
    return Customer;
}
