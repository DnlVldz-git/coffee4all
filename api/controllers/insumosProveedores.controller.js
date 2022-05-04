const db = require("../models");
const insumoProveedor= db.insumoProveedor;
const Op = db.Sequelize.Op;

// Crear y guardar un nuevo insumoProveedor
exports.create = (req, res) => {
    // Validar request    

    // Crear un insumoProveedor
    const insumoProveedorJson = {
        insumoId: req.body.insumoId,
        proveedorId: req.body.proveedorId,
        cantidad: req.body.cantidad,
        precio: req.body.precio
    };

    // Guardar insumoProveedor en la base de datos
    insumoProveedor.create(insumoProveedorJson)
        .then(data => {
            console.log(data);
        })
        .catch(err => {

            const message =  err.message + " insumosProveedores" || "Ocurrio un error al registrar el insumoProveedor."
            console.log(message);
        });
};

// Recuperar todos los insumoProveedors de la base de datos
exports.findAll = (req, res) => {

    insumoProveedor.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al recuperar todos los insumoProveedors."
            });
        });
};

// Encontrar insumoProveedor por id
exports.findOne = (req, res) => {
    const id = req.params.proveedorId;

    insumoProveedor.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar insumoProveedor con id = " + id
            });
        });
};

exports.findByProveedor = (req, res) => {
    const proveedorId = req.params.proveedorId;

    const condicion = { proveedorId: proveedorId };

    insumoProveedor.findAll({ where: condicion })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar insumoProveedor con id = " + id
            });
        });
};

// Actualizar insumoProveedor por id
exports.update = (req, res) => {
    const id = req.params.id;

    insumoProveedor.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "insumoProveedor se actualizo con exito."
                });
            } else {
                res.send({
                    message: `No se encontro al insumoProveedor con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar insumoProveedor con id = " + id
            });
        });
};

// Eliminar un insumoProveedor por id
exports.delete = (req, res) => {
    const id = req.productoId;

    insumoProveedor.destroy({
        where: { insumoId: id }
    })
        .then(num => {
            // if(num == 1){
            //     res.send({
            console.log("message: insumoProveedor eliminado con exito!");
            //     });
            //     //db.sequelize.query("ALTER SEQUENCE \"users_id_seq\" RESTART; UPDATE public.\"users\" SET id = DEFAULT;");
            // } else{
            //     res.send({
            //         message: `No se encontro el insumoProveedor con id = ${id}!`
            //     });
            // }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al eliminar insumoProveedor con id = " + id + err
            });
        });
};

// Eliminar todos los insumoProveedors de la base de datos
exports.deleteAll = (req, res) => {
    insumoProveedor.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} insumoProveedors fueron eliminados con exito!` })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || ""
            });
        });
};
