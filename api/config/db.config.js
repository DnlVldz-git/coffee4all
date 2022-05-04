module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD : process.env.DB_PASSWORD,
    DB : process.env.DB_DB,
    dialect : "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000, //tiempo máximo que se intentará conectar
        idle: 10000 //tiempo máximo en que conexión puede estar inactiva
    }
}