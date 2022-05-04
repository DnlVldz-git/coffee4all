module.exports = (sequelize, Sequelize) => {
    const Insumo = sequelize.define("insumo", {
        nombre: {
            type: Sequelize.STRING
        },
        medicion: {
            type: Sequelize.STRING
        },        
        foto: {
            type: Sequelize.STRING
        }
    });

    return Insumo;
}