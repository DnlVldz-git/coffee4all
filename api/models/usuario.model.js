module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        nombre: {
            type: Sequelize.STRING
        },
        apellido_pat: {
            type: Sequelize.STRING
        },
        apellido_mat: {
            type: Sequelize.STRING
        },
        foto: {
            type: Sequelize.STRING
        },
        telefono: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        pwd: {
            type: Sequelize.STRING
        },
        rol: {
            type: Sequelize.STRING
        }
    });

    return Usuario;
}