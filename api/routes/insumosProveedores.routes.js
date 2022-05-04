module.exports = app => {
    const adminOnly = require("../middleware/authMiddleware");
    const insumosProveedores = require("../controllers/insumosProveedores.controller.js");
    var router = require("express").Router();

    router.get("/",
        adminOnly,
        insumosProveedores.findAll
    );

    router.get("/:proveedorId",
        adminOnly,
        insumosProveedores.findByProveedor
    );

    app.use('/insumosProveedores/', router);
}