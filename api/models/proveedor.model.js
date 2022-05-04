module.exports = (sequelize, Sequelize) => {
    const Proveedor = sequelize.define("proveedor", {
        nombre: {
            type: Sequelize.STRING
        },
        telefono: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        }
    });

    return Proveedor;
}