module.exports = (sequelize, Sequelize) =>{
    const Kategori = sequelize.define('kategori', {
        name: {
            type: Sequelize.STRING,
        },
    });
    return Kategori;
}

// by default udah ada id, jadi gak perlu dibuat