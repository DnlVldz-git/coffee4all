module.exports = app => {
    const Venta = require("../controllers/venta.controller");
    const auth = require("../middleware/authMiddleware");
    var router = require("express").Router();

    router.post("/",
        auth,
        Venta.create
    );

    router.get("/",
        auth,
        Venta.findAll
    );

    router.get("/:id",
        auth,
        Venta.findOne
    );

    router.put("/:id",
        auth,
        Venta.update
    );

    router.delete("/:id",
        auth,
        Venta.delete
    );

    router.delete("/",
        auth,
        Venta.deleteAll
    );

    app.use('/ventas/', router);
}