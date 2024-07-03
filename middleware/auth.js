const dcm = require("../helper/decypher")

// Authenticates response data using a token provided in the header
module.exports = function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    const [par1, par2, par_3] = token.split('|');
    let par3 = par_3.split("/")
    const c = par3[0];
    const country = par3[1]
    const role = par3[2]
    const data = {
      country,
      role
    }

    let number1 = parseInt(par1);
    let number2 = parseInt(par2);
    let number3 = parseInt(c);
    let result = dcm(number1, number2, number3)
    if (result) {
      req.authData = data;
      next();

    } else {
      throw { status: 400, message: "Invalid Token" };
    }
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).send("Something went wrong...");
  }
}