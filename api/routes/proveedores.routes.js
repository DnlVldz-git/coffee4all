module.exports = app => {
    const Proveedor = require("../controllers/proveedores.controller");
    const adminOnly = require("../middleware/authMiddleware");   
    var router = require("express").Router();

    router.post("/",
        adminOnly, Proveedor.create
    );

    router.get("/",
        adminOnly,
        Proveedor.findAll
    );

    router.get("/:id",
        adminOnly,
        Proveedor.findOne
    );

    router.put("/:id",
        adminOnly,
        Proveedor.update

    );

    router.delete("/:id",
        adminOnly,
        Proveedor.delete

    );

    router.delete("/",
        adminOnly,
        Proveedor.deleteAll
    );

    app.use('/proveedores/', router);
}