const db = require("../models");
const Usuario = db.usuario;
const Op = db.Sequelize.Op;
const jwtService = require("../services/jwt.service");
const jwtServiceInstance = new jwtService();
var CryptoJS = require("crypto-js");
var sha256 = require('js-sha256');


// Crear y guardar un nuevo usuario
exports.create = (req, res) => {
    // Validar request
    if (!req.body.nombre && !req.body.apellido_pat && !req.body.apellido_mat && !req.body.email && !req.body.telefono && !req.body.pwd) {
        res.status(400).send({
            message: "El contenido no puede ser vacio, nombre = " + req.body.nombre + " , " +
                "apellido paterno = " + req.body.apellido_pat + ", apellido materno = " + req.body.apellido_mat
                + ", correo = " + req.body.email
        });
        return;
    }

    Usuario.findAll({ where: { email: req.body.email } }).then(response1 => {
        if (response1[0]) {            
            res.send("usuario existente");
        } else {
            // Crear un usuario
            var decryptedBytes = CryptoJS.AES.decrypt(req.body.pwd, "cfa");
            var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);

            const usuario = {
                nombre: req.body.nombre,
                apellido_pat: req.body.apellido_pat,
                apellido_mat: req.body.apellido_mat,
                foto: req.body.foto,
                telefono: req.body.telefono,
                email: req.body.email,
                pwd: sha256(plaintext).toUpperCase(),
                rol: req.body.rol,
            };

            // Guardar Usuario en la base de datos
            Usuario.create(usuario)
                .then(data => {
                    const simpleUsuario = {
                        id: data.id,
                        nombre: req.body.nombre,
                        email: req.body.email
                    }

                    jwtServiceInstance.sign(simpleUsuario).then(response => {
                        data = {
                            data,
                            token: response
                        }
                        res.send(data);
                    })
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Ocurrio un error al registrar el usuario."
                    });
                });
        }
    })
};

// Recuperar todos los Usuarios de la base de datos
exports.findAll = (req, res) => {
    const limit = req.params.limit;
    const offset = req.params.offset;
    Usuario.findAndCountAll({
        offset: offset,
        limit: limit
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al recuperar todos los usuarios."
            });
        });
};

exports.login = (req, res) => {
    Usuario.findAll({ where: { email: req.body.email } })
        .then(data => {
            dataJson = {
                email: data[0].email,
                pwd: data[0].pwd,
                nombre: data[0].nombre
            }

            var decryptedBytes = CryptoJS.AES.decrypt(req.body.pwd, "cfa");
            var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);

            if ((req.body.email === data[0].email) && (sha256(plaintext).toUpperCase() === data[0].pwd)) {
                jwtServiceInstance.sign(dataJson).then(response => {
                    dataSent = {
                        user: data[0],
                        token: response
                    }
                    res.send(dataSent);
                })
            } else {
                res.send("Credenciales Incorrectas")
            }



        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al recuperar el usuario."
            });
        });
};

// Encontrar Usuario por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Usuario.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar usuario con id = " + id
            });
        });
};

exports.isAdmin = (req, res) => {
    const id = body.id;

    Usuario.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error al recuperar usuario con id = " + id
            });
        });
};

// Actualizar Usuario por id
exports.update = (req, res) => {
    const id = req.params.id;

    var decryptedBytes = CryptoJS.AES.decrypt(req.body.pwd, "cfa");
    var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);

    req.body.pwd = sha256(plaintext).toUpperCase();

    Usuario.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Usuario se actualizo con exito."
                });
            } else {
                res.send({
                    message: `No se encontro al usuario con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar usuario con id = " + id
            });
        });
};

// Eliminar un Usuario por id
exports.delete = (req, res) => {
    const id = req.params.id;

    Usuario.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Usuario eliminado con exito!"
                });
                //db.sequelize.query("ALTER SEQUENCE \"users_id_seq\" RESTART; UPDATE public.\"users\" SET id = DEFAULT;");
            } else {
                res.send({
                    message: `No se encontro el usuario con id = ${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al eliminar Usuario con id = " + id
            });
        });
};

// Eliminar todos los Usuarios de la base de datos
exports.deleteAll = (req, res) => {
    Usuario.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Usuarios fueron eliminados con exito!` })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || ""
            });
        });
};

// Encontrar todos los Usuarios por correo
exports.findByRol = (req, res) => {
    const rol = req.params.rol;
    var condition = rol ? { rol: { [Op.eq]: `${rol}` } } : null;

    Usuario.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al recuperar usuarios por rol."
            });
        });
};