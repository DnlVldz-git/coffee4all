const express = require("express");//construir API rest
const bodyParser = require("body-parser"); // 
const cors = require("cors");
require("dotenv").config();

//crear una aplicación Express
const app = express();

// configuramos origin: http:// localhost: 9596
var corsOptions = {
    origin : process.env.ORIGIN
}

app.use(cors(corsOptions));

//realizar parse de content-type - application/json de requests
app.use(bodyParser.json());

//realizar parse de content-type -- application/x-www-form-urlencoded de requests
app.use(bodyParser.urlencoded({extended: true}));

//habilitar el cors

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
  
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  
    next();
  
  });
  
  app.use(express.json());
  
  app.use(express.urlencoded({ extended: false }));


const db = require("./models");

db.sequelize.sync({alter:true}).then(() => {
    console.log("Se sincronizó la db");
})

// require("./routes/rol.routes.js")(app);
// require("./routes/usuario.routes.js")(app);

//asignar port para escuchar requets
const PORT = process.env.PORT || 9595;
app.listen(PORT, () => {
    console.log(`Server está ejecutándose en puerto ${PORT}.`);
});

require("./routes/insumos.routes")(app);
require("./routes/productos.routes")(app);
require("./routes/proveedores.routes")(app);
require("./routes/usuarios.routes")(app);
require("./routes/venta.routes")(app);
require("./routes/insumosProductos.routes")(app);
require("./routes/insumosProveedores.routes")(app);
require("./routes/ventasProductos.routes")(app);
require("./routes/ventasInsumos.routes")(app);
require("./routes/imagenes.routes")(app);

