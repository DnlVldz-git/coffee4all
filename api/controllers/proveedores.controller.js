const db = require("../models");
const Proveedor = db.proveedor;
const insumoProveedor = db.insumoProveedor;
const insumoProveedor2 = require("./insumosProveedores.controller");
const Op = db.Sequelize.Op;

// Crear y guardar un nuevo Proveedor
exports.create = (req, res) => {
    // Validar request    

    // Crear un Proveedor
    const proveedor = {
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        email: req.body.email
    };

    // Guardar Proveedor en la base de datos
    Proveedor.create(proveedor)
        .then(data => {
            for (let i = 0; i < req.body.insumos.length; i++) {
                const data2 = {
                    body: {
                        insumoId: req.body.insumos[i].insumoId,
                        proveedorId: data.id,
                        cantidad: req.body.insumos[i].cantidad,
                        precio: req.body.insumos[i].precio
                    }
                }
                insumoProveedor2.create(data2);
            }
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al registrar el Proveedor."
            });
        });

};

// Recuperar todos los Proveedors de la base de datos
exports.findAll = (req, res) => {

    const limit = req.query.limit;
    const offset = req.query.offset;

    Proveedor.findAndCountAll({
        offset: offset,
        limit: limit
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al recuperar todos los Proveedors."
            });
        });
};

// Encontrar Proveedor por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Proveedor.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar Proveedor con id = " + id
            });
        });
};

// Actualizar Proveedor por id
exports.update = (req, res) => {
    const id = req.params.id;

    insumoProveedor.destroy({ where: { proveedorId: id } })

    Proveedor.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                for (let i = 0; i < req.body.insumos.length; i++) {
                    const data2 = {
                        body: {
                            insumoId: req.body.insumos[i].insumoId,
                            proveedorId: id,
                            cantidad: req.body.insumos[i].cantidad,
                            precio: req.body.insumos[i].precio
                        }
                    }
                    insumoProveedor2.create(data2);
                }
                res.send({
                    message: "Proveedor se actualizo con exito."
                });
            } else {
                res.send({
                    message: `No se encontro al Proveedor con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar Proveedor con id = " + id
            });
        });
};

// Eliminar un Proveedor por id
exports.delete = (req, res) => {
    const id = req.params.id;

    insumoProveedor.destroy({ where: { proveedorId: id } })

    Proveedor.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Proveedor eliminado con exito!"
                });
                //db.sequelize.query("ALTER SEQUENCE \"users_id_seq\" RESTART; UPDATE public.\"users\" SET id = DEFAULT;");
            } else {
                res.send({
                    message: `No se encontro el Proveedor con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al eliminar Proveedor con id = " + id
            });
        });
};

// Eliminar todos los Proveedors de la base de datos
exports.deleteAll = (req, res) => {

    insumoProveedor.destroy({ where: {} })

    Proveedor.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Proveedors fueron eliminados con exito!` })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || ""
            });
        });
};
