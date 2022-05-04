const db = require("../models");
const Insumo = db.insumo;
const Op = db.Sequelize.Op;

// Crear y guardar un nuevo Insumo
exports.create = (req, res) => {
    // Validar request    

    // Crear un Insumo
    const insumo = {
        nombre: req.body.nombre,
        medicion: req.body.medicion,
        foto: req.body.foto
    };

    // Guardar Insumo en la base de datos
    Insumo.create(insumo)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Ocurrio un error al registrar el Insumo."
            });
        });
};

// Recuperar todos los Insumos de la base de datos
exports.findAll = (req, res) => {    
    const limit = req.query.limit;
    const offset = req.query.offset;    
    Insumo.findAndCountAll({
        offset: offset,
        limit: limit
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Ocurrio un error al recuperar todos los Insumos."
        });
      });
};

// Encontrar Insumo por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Insumo.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar Insumo con id = " + id
            });
        });
};

// Actualizar Insumo por id
exports.update = (req, res) => {
    const id = req.params.id;

    Insumo.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if(num == 1){
                res.send({
                    message: "Insumo se actualizo con exito."
                });
            } else{
                res.send({
                    message: `No se encontro al Insumo con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar Insumo con id = " + id
            });
        });
};

// Eliminar un Insumo por id
exports.delete = (req, res) => {
    const id = req.params.id;

    Insumo.destroy({
        where: { id: id }
    })
        .then(num => {
            if(num == 1){
                res.send({
                    message: "Insumo eliminado con exito!"
                });
                //db.sequelize.query("ALTER SEQUENCE \"users_id_seq\" RESTART; UPDATE public.\"users\" SET id = DEFAULT;");
            } else{
                res.send({
                    message: `No se encontro el Insumo con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al eliminar Insumo con id = " + id
            });
        });
};

// Eliminar todos los Insumos de la base de datos
exports.deleteAll = (req, res) => {
    Insumo.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Insumos fueron eliminados con exito!` })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || ""
            });
        });
};
