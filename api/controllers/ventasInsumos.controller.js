const db = require("../models");
const ventasInsumos= db.ventasInsumos;
const Op = db.Sequelize.Op;

// Crear y guardar un nuevo ventasInsumos
exports.create = (req, res) => {
    // Validar request    

    // Crear un ventasInsumos
    const ventasInsumosJson = {
        ventumId: req.body.ventumId,
        insumoId: req.body.insumoId 
    };

    // Guardar ventasInsumos en la base de datos
    ventasInsumos.create(ventasInsumosJson)
        .then(data => {
            console.log(data);
        })
        .catch(err => {

            const message =  err.message + " ventasInsumos" || "Ocurrio un error al registrar el ventasInsumos."
            console.log(message);
        });
};

// Recuperar todos los ventasInsumoss de la base de datos
exports.findAll = (req, res) => {

    ventasInsumos.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al recuperar todos los ventasInsumoss."
            });
        });
};

// Encontrar ventasInsumos por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    ventasInsumos.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar ventasInsumos con id = " + id
            });
        });
};

exports.findByVenta = (req, res) => {
    const id = req.params.ventumId;

    const condicion = { ventumId: id };

    ventasInsumos.findAll({ where: condicion })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar ventasInsumos con id = " + id
            });
        });
};

// Actualizar ventasInsumos por id
exports.update = (req, res) => {
    const id = req.params.id;

    ventasInsumos.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ventasInsumos se actualizo con exito."
                });
            } else {
                res.send({
                    message: `No se encontro al ventasInsumos con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar ventasInsumos con id = " + id
            });
        });
};

// Eliminar un ventasInsumos por id
exports.delete = (req, res) => {
    const id = req.ventumId;

    ventasInsumos.destroy({
        where: { insumoId: id }
    })
        .then(num => {
            // if(num == 1){
            //     res.send({
            console.log("message: ventasInsumos eliminado con exito!");
            //     });
            //     //db.sequelize.query("ALTER SEQUENCE \"users_id_seq\" RESTART; UPDATE public.\"users\" SET id = DEFAULT;");
            // } else{
            //     res.send({
            //         message: `No se encontro el ventasInsumos con id = ${id}!`
            //     });
            // }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al eliminar ventasInsumos con id = " + id + err
            });
        });
};

// Eliminar todos los ventasInsumoss de la base de datos
exports.deleteAll = (req, res) => {
    ventasInsumos.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} ventasInsumos fueron eliminados con exito!` })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || ""
            });
        });
};
