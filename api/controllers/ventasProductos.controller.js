const db = require("../models");
const ventasProductos= db.ventasProductos;
const Op = db.Sequelize.Op;

// Crear y guardar un nuevo ventasProductos
exports.create = (req, res) => {
    // Validar request    

    // Crear un ventasProductos
    const ventasProductosJson = {
        ventumId: req.body.ventumId,
        productoId: req.body.productoId        
    };

    // Guardar ventasProductos en la base de datos
    ventasProductos.create(ventasProductosJson)
        .then(data => {
            console.log(data);
        })
        .catch(err => {

            const message =  err.message + " ventasProductos" || "Ocurrio un error al registrar el ventasProductos."
            console.log(message);
        });
};

// Recuperar todos los ventasProductoss de la base de datos
exports.findAll = (req, res) => {

    ventasProductos.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al recuperar todos los ventasProductoss."
            });
        });
};

// Encontrar ventasProductos por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    ventasProductos.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar ventasProductos con id = " + id
            });
        });
};

exports.findByVenta = (req, res) => {
    const id = req.params.ventumId;

    const condicion = { ventumId: id };

    ventasProductos.findAll({ where: condicion })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar ventasProductos con id = " + id
            });
        });
};

// Actualizar ventasProductos por id
exports.update = (req, res) => {
    const id = req.params.id;

    ventasProductos.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ventasProductos se actualizo con exito."
                });
            } else {
                res.send({
                    message: `No se encontro al ventasProductos con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar ventasProductos con id = " + id
            });
        });
};

// Eliminar un ventasProductos por id
exports.delete = (req, res) => {
    const id = req.ventumId;

    ventasProductos.destroy({
        where: { insumoId: id }
    })
        .then(num => {
            // if(num == 1){
            //     res.send({
            console.log("message: ventasProductos eliminado con exito!");
            //     });
            //     //db.sequelize.query("ALTER SEQUENCE \"users_id_seq\" RESTART; UPDATE public.\"users\" SET id = DEFAULT;");
            // } else{
            //     res.send({
            //         message: `No se encontro el ventasProductos con id = ${id}!`
            //     });
            // }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al eliminar ventasProductos con id = " + id + err
            });
        });
};

// Eliminar todos los ventasProductoss de la base de datos
exports.deleteAll = (req, res) => {
    ventasProductos.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} ventasProductoss fueron eliminados con exito!` })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || ""
            });
        });
};
