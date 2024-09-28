const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Invalid auth header",
    });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  console.log(token + " token ");
  try {
    //Testing token
    //     console.log(token)
    //     const parts = token.split('.');
    //     console.log(parts.length)
    //   if (parts.length !== 3){
    //     console.log("Incorrect Token")
    //   }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded.userId+" UID");
    if (!(decoded.userId)) {
        return res.status(403).json({
            message: "Invalid auth header2",
          });
    } else {
        //console.log(userId + " ID ");
        req.userId = decoded.userId;
        //console.log(userId + " ID ");
        next();
      
    }
    //next()
  } catch (err) {
    console.log(err)
    return res.status(403).json({
      message: "Invalid auth header3",
    });
  }
};

module.exports = {
  authMiddleware,
};
