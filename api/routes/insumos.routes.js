module.exports = app =>{
    const Insumo = require("../controllers/insumos.controller.js");
    var router = require("express").Router();    
    const adminOnly = require("../middleware/authMiddleware");

    router.post("/", adminOnly, Insumo.create);

    router.get("/", adminOnly, Insumo.findAll);

    router.get("/:id", adminOnly, Insumo.findOne);

    router.put("/:id", adminOnly, Insumo.update );

    router.delete("/:id", adminOnly, Insumo.delete);

    router.delete("/", adminOnly, Insumo.deleteAll);
    
    app.use('/insumos/', router);
}