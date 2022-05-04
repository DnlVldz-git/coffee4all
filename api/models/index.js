const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const { HasMany } = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: process.env.DB_PORT,
    operatorsAliases: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false 
        }
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usuario = require("./usuario.model.js")(sequelize, Sequelize);
db.venta = require("./venta.model.js")(sequelize, Sequelize);
db.insumo = require("./insumo.model.js")(sequelize, Sequelize);
db.producto = require("./producto.model.js")(sequelize, Sequelize);
db.proveedor = require("./proveedor.model.js")(sequelize, Sequelize);

db.insumoProveedor = sequelize.define('insumoProveedor', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    precio: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    cantidad: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
});

db.insumoProductos = sequelize.define('insumoProductos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cantidad: {
        type: Sequelize.FLOAT,
        allowNull: true
    }
});

db.ventasProductos = sequelize.define('ventasProductos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
});

db.ventasInsumos = sequelize.define('ventasInsumos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
})

db.ventasInsumos.belongsTo(db.insumo);
db.ventasInsumos.belongsTo(db.venta);

db.usuario.hasMany(db.venta);
db.insumoProveedor.belongsTo(db.insumo);
db.insumoProveedor.belongsTo(db.proveedor);

db.insumoProductos.belongsTo(db.insumo);
db.insumoProductos.belongsTo(db.producto);

db.ventasProductos.belongsTo(db.venta);
db.ventasProductos.belongsTo(db.producto);

module.exports = db;    