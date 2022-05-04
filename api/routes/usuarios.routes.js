module.exports = app =>{
    const Usuario = require("../controllers/usuarios.controller");
    var router = require("express").Router();
    const adminOnly = require("../middleware/authMiddleware");   

    router.post("/", Usuario.create);

    router.post("/login", Usuario.login);

    router.get("/",  Usuario.findAll);

    router.get("/:id", adminOnly , Usuario.findOne);

    router.put("/:id",adminOnly , Usuario.update);

    router.delete("/:id", adminOnly , Usuario.delete);

    router.delete("/", adminOnly ,Usuario.deleteAll);
    
    app.use('/usuarios/', router);
}

