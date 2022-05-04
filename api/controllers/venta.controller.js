const db = require("../models");
const Venta = db.venta;
const ventasProductos= db.ventasProductos;
const ventasInsumos= db.ventasInsumos;
const ventasProductos2 = require("./ventasProductos.controller");
const ventasInsumos2 = require("./ventasInsumos.controller");
const Op = db.Sequelize.Op;

// Crear y guardar un nuevo Venta
exports.create = (req, res) => {

    // Crear un Venta
    const venta = {
        nombre: req.body.nombre,
        usuarioId: req.body.usuarioId,
        fecha: req.body.fecha,
        total: req.body.total
    };

    // Guardar Venta en la base de datos
    Venta.create(venta)
        .then(data => {
            for (let i = 0; i < req.body.productos.length; i++) {
                const data2 = {
                    body: {
                        productoId: req.body.productos[i].id,
                        ventumId: data.id
                    }
                }
                ventasProductos2.create(data2);
            }
            for (let i = 0; i < req.body.insumos.length; i++) {
                const data2 = {
                    body: {
                        insumoId: req.body.insumos[i].insumoId,
                        ventumId: data.id
                    }
                }
                ventasInsumos2.create(data2);
            }
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Ocurrio un error al registrar el Venta."
            });
        });

};

// Recuperar todos los Ventas de la base de datos
exports.findAll = (req, res) => {    
    const limit = req.query.limit;
    const offset = req.query.offset;
    
    Venta.findAndCountAll({
        offset: offset,
        limit: limit
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Ocurrio un error al recuperar todos los Ventas."
        });
      });
};

// Encontrar Venta por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Venta.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar Venta con id = " + id
            });
        });
};

// Actualizar Venta por id
exports.update = (req, res) => {
    const id = req.params.id;

    
    ventasProductos.destroy({where: {ventumId: id}})
    ventasInsumos.destroy({where: {ventumId: id}})

    Venta.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if(num == 1){
                for (let i = 0; i < req.body.productos.length; i++) {
                    const data2 = {
                        body: {
                            productoId: req.body.productos[i].id,
                            ventumId: id
                        }
                    }
                    ventasProductos2.create(data2);
                }
                for (let i = 0; i < req.body.insumos.length; i++) {
                    const data2 = {
                        body: {
                            insumoId: req.body.insumos[i].id,
                            ventumId: id
                        }
                    }
                    ventasInsumos2.create(data2);
                }
                res.send({
                    message: "Venta se actualizo con exito."
                });
            } else{
                res.send({
                    message: `No se encontro al Venta con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar Venta con id = " + id
            });
        });
};

// Eliminar un Venta por id
exports.delete = (req, res) => {
    const id = req.params.id;

    ventasProductos.destroy({where: {ventumId: id}})
    Venta.destroy({
        where: { id: id }
    })
        .then(num => {
            if(num == 1){
                res.send({
                    message: "Venta eliminado con exito!"
                });
                //db.sequelize.query("ALTER SEQUENCE \"users_id_seq\" RESTART; UPDATE public.\"users\" SET id = DEFAULT;");
            } else{
                res.send({
                    message: `No se encontro el Venta con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al eliminar Venta con id = " + id
            });
        });
};

// Eliminar todos los Ventas de la base de datos
exports.deleteAll = (req, res) => {
    ventasProductos.destroy({where: {}})
    
    Venta.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Ventas fueron eliminados con exito!` })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || ""
            });
        });
};

