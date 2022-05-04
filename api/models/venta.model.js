module.exports = (sequelize, Sequelize) => {
    const Venta = sequelize.define("venta", {
        nombre: {
            type: Sequelize.STRING
        },
        fecha: {
            type: Sequelize.DATE
        },
        total: {
            type: Sequelize.DOUBLE
        }
    });

    return Venta;
}