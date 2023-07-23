const { fireAuth } = require("./firebase")

// Middleware to verify session cookie for protected API endpoints
async function verifyAuthCookie (req, res, next) {
  const authCookie = req.cookies.authCookie;
  console.log(req.cookies)
  
  if (authCookie == undefined || authCookie == "") {
    console.log("session cookie missing")
    return res.status(401).send("Unauthorised");
  }

  try {
    const decodedToken = await fireAuth.verifySessionCookie(authCookie);
    console.log("session cookie is authenticated")
    next();
  } catch (error) {
    console.log('Failed to verify session cookie: ', error);
    res.status(401).send('Unauthorized');
  }
}

module.exports = {
  verifyAuthCookie
}