const db = require("../models");
const insumoProductos = db.insumoProductos;
const Op = db.Sequelize.Op;

// Crear y guardar un nuevo insumoProductos
exports.create = (req, res) => {
    // Validar request    

    // Crear un insumoProductos
    const insumoProductosJson = {
        insumoId: req.body.insumoId,
        productoId: req.body.productoId,
        cantidad: req.body.cantidad
    };

    // Guardar insumoProductos en la base de datos
    insumoProductos.create(insumoProductosJson)
        .then(data => {
            console.log(data);
        })
        .catch(err => {

            const message =  err.message + " insumosProductos" || "Ocurrio un error al registrar el insumoProductos."
            console.log(message);
        });
};

// Recuperar todos los insumoProductoss de la base de datos
exports.findAll = (req, res) => {

    insumoProductos.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al recuperar todos los insumoProductoss."
            });
        });
};

// Encontrar insumoProductos por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    insumoProductos.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar insumoProductos con id = " + id
            });
        });
};

exports.findByProduct = (req, res) => {
    const productoId = req.params.productoId;

    const condicion = { productoId: productoId };

    insumoProductos.findAll({ where: condicion })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar insumoProductos con id = " + id
            });
        });
};

// Actualizar insumoProductos por id
exports.update = (req, res) => {
    const id = req.params.id;

    insumoProductos.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "insumoProductos se actualizo con exito."
                });
            } else {
                res.send({
                    message: `No se encontro al insumoProductos con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar insumoProductos con id = " + id
            });
        });
};

// Eliminar un insumoProductos por id
exports.delete = (req, res) => {
    const id = req.productoId;

    insumoProductos.destroy({
        where: { insumoId: id }
    })
        .then(num => {
            // if(num == 1){
            //     res.send({
            console.log("message: insumoProductos eliminado con exito!");
            //     });
            //     //db.sequelize.query("ALTER SEQUENCE \"users_id_seq\" RESTART; UPDATE public.\"users\" SET id = DEFAULT;");
            // } else{
            //     res.send({
            //         message: `No se encontro el insumoProductos con id = ${id}!`
            //     });
            // }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al eliminar insumoProductos con id = " + id + err
            });
        });
};

// Eliminar todos los insumoProductoss de la base de datos
exports.deleteAll = (req, res) => {
    insumoProductos.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} insumoProductoss fueron eliminados con exito!` })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || ""
            });
        });
};
