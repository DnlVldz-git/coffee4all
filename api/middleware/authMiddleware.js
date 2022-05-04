
const Usuario = require("../controllers/usuarios.controller");
const jwtService = require("../services/jwt.service");
const jwtServiceInstance = new jwtService();

module.exports = async function auth(ctx, next) {
  try {
    const token = ctx.request.headers.Authentication;

    if (token) {
      const user = await jwtServiceInstance.verify(token);
      ctx.currentUser = user;
      return next();
    } else {
      throw "no token";
    }
  } catch (e) {
    ctx.response.status = 401;
    ctx.response.body = "Invalid token.";
  }
}

module.exports = async function adminOnly(ctx, next) {
  try {
    const token = ctx.request.headers.authentication;
    if (token) {
      const currentUser = await jwtServiceInstance.verify(token);
      const user = Usuario.isAdmin(currentUser.id);

      ctx.currentUser = user;
      if (user.rol == "Admin") {
        return next();
      }
    } else {
      throw "no token";
    }
  } catch (e) {
    ctx.response.status = 401;
    ctx.response.body = "Invalid token.";
  }
}

module.exports = async function loginAuth(token, body, data, res) {
  try {

    if (token) {
      jwtServiceInstance.verify(token).then(response => {
        if (data.pwd === body.pwd && data.email === body.email) {
          res.send("login exitoso");
        } else {
          res.send("error");
        }
      }).catch(e => {
        console.error(e);
        return false;
      });

    } else {
      throw "no token";
    }
  } catch (e) {
    console.error(e);
    res.send(e.message);
  }
}
