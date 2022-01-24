import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import userModel from "../model/userModel.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    // use the token to get the user id
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETE);
        const user = await userModel.findOne({
          _id: decoded._id,
          "tokens.token": token,
        });
        if (!user) {
          return res.status(401).json({
            message: "No User Found",
            code: 401,
          });
        }
        req.token = token;
        req.user = user;

        next();
      } catch (error) {
        if (!token)
          return res.status(498).json({ message: "Invalid Token", code: 498 });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "No token, authorization denied  last error",
      code: 401,
    });
  }
};
