const db = require("../models");
const Producto = db.producto;
const insumoProductos = db.insumoProductos;
const insumoProductos2 = require("./insumosProductos.controller")
const Op = db.Sequelize.Op;

// Crear y guardar un nuevo Producto
exports.create = (req, res) => {
    // Validar request    

    console.log(req.body);

    // Crear un Producto
    const producto = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        foto: req.body.foto
    };

    // Guardar Producto en la base de datos
    Producto.create(producto).then(data => {

        for (let i = 0; i < req.body.insumos.length; i++) {
            const data2 = {
                body: {
                    insumoId: req.body.insumos[i].insumoId,
                    productoId: data.id,
                    cantidad: req.body.insumos[i].cantidad
                }
            }
            insumoProductos2.create(data2);
        }
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message + " productos" || "Ocurrio un error al registrar el Producto."
            });
        });

};

// Recuperar todos los Productos de la base de datos
exports.findAll = (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;

    Producto.findAndCountAll({
        offset: offset,
        limit: limit
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al recuperar todos los Productos."
            });
        });
};

// Encontrar Producto por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Producto.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar Producto con id = " + id
            });
        });
};

// Actualizar Producto por id
exports.update = (req, res) => {
    const id = req.params.id;
    const data = req.body;

    insumoProductos.destroy({ where: { productoId: id } })

    Producto.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                for (let i = 0; i < req.body.insumos.length; i++) {
                    const data2 = {
                        body: {
                            insumoId: req.body.insumos[i].insumoId,
                            productoId: id,
                            cantidad: req.body.insumos[i].cantidad
                        }
                    }
                    insumoProductos2.create(data2);
                }
                res.send({
                    message: "Producto se actualizo con exito."
                });
            } else {
                res.send({
                    message: `No se encontro al Producto con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar Producto con id = " + id
            });
        });
};

// Eliminar un Producto por id
exports.delete = (req, res) => {
    const id = req.params.id;
    insumoProductos.destroy({ where: { productoId: id } })
    Producto.delete({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Producto eliminado con exito!"
                });
                //db.sequelize.query("ALTER SEQUENCE \"users_id_seq\" RESTART; UPDATE public.\"users\" SET id = DEFAULT;");
            } else {
                res.send({
                    message: `No se encontro el Producto con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({

                message: "Error al eliminar Producto con id = " + id + err
            });
        });
};

// Eliminar todos los Productos de la base de datos
exports.deleteAll = (req, res) => {

    insumoProductos.destroy({ where: {} })
    Producto.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Productos fueron eliminados con exito!` })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || ""
            });
        });
};
