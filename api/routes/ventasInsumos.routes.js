module.exports = app =>{
    const ventasInsumos = require("../controllers/ventasInsumos.controller");
    const adminOnly = require("../middleware/authMiddleware");  
    var router = require("express").Router();

    router.get("/", adminOnly, ventasInsumos.findAll);

    router.get("/:ventumId",adminOnly, ventasInsumos.findByVenta );
    
    app.use('/ventasInsumos/', router);
}