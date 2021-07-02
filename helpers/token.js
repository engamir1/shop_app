const expressjwt = require("express-jwt");

function authjwt() {
  const secret = process.env.SECRET_KEY;
  const api = process.env.API_URl;
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked
  }).unless({
    path: [
      // allow get and olptions only and prevent other methods
      // { url: `${api}/products`, method: ["GET", "OPTIONS"] }, after use regex
      // use this website to test regx : https://regex101.com/
      { url: /\api\/v1\/products(.*)/, method: ["GET", "OPTIONS"] },
      { url: /\api\/v1\/categories(.*)/, method: ["GET", "OPTIONS"] },
      // this path dont need token to go
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}
module.exports = authjwt;
