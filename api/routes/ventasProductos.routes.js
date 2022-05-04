module.exports = app =>{
    const ventasProductos = require("../controllers/ventasProductos.controller");
    const adminOnly = require("../middleware/authMiddleware");  
    var router = require("express").Router();

    router.get("/", adminOnly, ventasProductos.findAll);

    router.get("/:ventaIsumId", adminOnly, ventasProductos.findByVenta);
    
    app.use('/ventasProductos/', router);
}