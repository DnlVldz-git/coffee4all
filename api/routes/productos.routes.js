module.exports = app =>{
    const Producto = require("../controllers/productos.controller");
    var router = require("express").Router();
    const adminOnly = require("../middleware/authMiddleware");   

    router.post("/",adminOnly, 
        Producto.create
    );

    router.get("/", 
    adminOnly,
        Producto.findAll
    );

    router.get("/:id", 
    adminOnly, 
        Producto.findOne
    );

    router.put("/:id",
    adminOnly, 
        Producto.update
    );

    router.delete("/:id", 
    adminOnly, 
        Producto.delete
    );

    router.delete("/", adminOnly, 
        Producto.deleteAll
    );
    
    app.use('/productos/', router);
}