
Pasos para ejecutar este proyecto:

1. ejecuta el comando `npm install`
2. ejecuta el comando `node index.js`

#Seed

1. Ve al archivo config/config.json
2. En el objeto "development" pon los datos de tu base de datos local

por ejemplo: 

"development": {
    "username": "postgres",
    "password": "123",
    "database": "coffee4all",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },

posteriormente ejecutar el comando: 

$ npx sequelize-cli db:seed:all

Se creará un usuario en su base de datos con el correo: 
## ejemplo@gmail.com

y la contraseña:

## dani
# Variables de entorno

### Crea un archivo .env en la carpeta /api
### Introduce las siguientes variables

## Configuracion general
* C4A_SECRET=
* PORT=
* ORIGIN= (dirección url de la aplicación de front end)

## Configuracion db
* DB_HOST=
* DB_PORT=
* DB_DB="coffee4all"
* DB_USER=
* DB_PASSWORD=

## Configuracion aws
* Q_ACCESS_KEY_ID=
* Q_SECRET_ACCESS_KEY=
* Q_AWS_REGION=
* Q_S3_BUCKET=
