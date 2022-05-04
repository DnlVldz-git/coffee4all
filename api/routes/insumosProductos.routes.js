
module.exports = app =>{
    const insumosProductos = require("../controllers/insumosProductos.controller");
    var router = require("express").Router();    
    const adminOnly = require("../middleware/authMiddleware");   

    router.get("/", adminOnly, insumosProductos.findAll);

    router.get("/:productoId", adminOnly, insumosProductos.findByProduct);
    
    app.use('/insumosProductos/', router);
}