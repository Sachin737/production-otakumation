import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protection middlewares
const protectRoute = async (req, res, next) => {
  try {
    // console.log(req?.headers?.authorization, "||", process.env.JWT_SECRET);

    const decode = JWT.verify(
      req?.headers?.authorization,
      process.env.JWT_SECRET
    );

    req.user = decode;
    next();
  } catch (err) {
    res.status(401).send({
      status: false,
      message: "error in Token verification!",
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role === 1) {
      next();
    } else {
      return res.status(401).send({
        status: false,
        message: "Unauthorized user!",
      });
    }
  } catch (err) {
    res.status(401).send({
      status: false,
      message: "error in isAdmin middleware",
    });
  }
};

export { protectRoute, isAdmin };
