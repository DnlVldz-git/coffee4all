
const jwt = require("jsonwebtoken");
const secret = process.env.C4A_SECRET;

module.exports = class jwtService {
  async sign(user) {
    return await jwt.sign(
      {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
      },
      secret,
      { expiresIn: "365d" }
    );
  }

  async verify(token) {
    const data = await jwt.verify(token, secret);
    return data;
  };
}



