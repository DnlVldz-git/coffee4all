module.exports = (sequelize, Sequelize) => {
    const Producto = sequelize.define("producto", {
        nombre: {
            type: Sequelize.STRING
        },
        precio: {
            type: Sequelize.FLOAT
        },
        foto: {
            type: Sequelize.STRING
        },
        
    });

    return Producto;
}