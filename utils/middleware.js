const logger = require("../utils/logger");
const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const userServices = require("../services/userservice");
// const redisService = require("../services/redisService");

const verifyToken = async (req, res, next) => {
  logger.info("Middleware/verifyToken");
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({
        status: "error",
        message: "No token provided",
      });
    }
    const decoded = jwt.verify(token, config.SECRET);
    let user = await userServices.findUserByOne("_id", decoded.id);
    if (!user) {
      return res.status(403).json({
        status: "error",
        message: "Failed to authenticate token",
      });
    }
    req.userId = decoded.id;
    req.user = user;
    // let redistoken = await redisService.getArray(req.userId);
    // if (!(redistoken[0] == token || redistoken[1] == token)) {
    //   return res.status(403).json({
    //     status: "error",
    //     message: "Expired or Invalid token",
    //   });
    // }
    next();
  } catch (err) {
    if (err.name == "MongooseError") {
      return res.status(401).json({
        status: "error",
        message: "Internal Server Error.",
      });
    } else {
      return res.status(401).json({
        status: "error",
        message: "Invalid token or expired token.",
      });
    }
  }
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: You do not have the required permissions" });
    }
    next();
  };
};

module.exports = authorizeRole;


const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  // logger.error(error.name);
  logger.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).json({
      status: "error",
      message: "improper arguments passed through",
    });
  } 
  if (error.name === "ValidationError") {
    return response.status(400).json({
      status: "error",
      message: error.message,
    });
  }
  if (error.name === "SyntaxError") {
    return response.status(400).json({
      status: "error",
      message: "Syntax Error",
    });
  }
  if (error.name === "ReferenceError") {
    return response.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  } 

  // Fallback for unknown errors
  return response.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

const unknownEndpoint = (req, res) => {
  return res.status(404).json({
    status: "error",
    message: "Unknown endpoint",
  });
};

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  verifyToken,
  authorizeRole,
};
