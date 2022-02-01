import verificationEmailTokenModel from "../model/veificationEmailToken.js";

import crypto from "crypto";
export const generateConfirmationToken = async (user) => {
  try {
    let verifyEmailToken = crypto.randomBytes(10).toString("hex");
    const verifyEmailExpires = Date.now() + 3600000; //expires in an hour
    const userId = user._id;
    const newData = await new verificationEmailTokenModel({
      verifyEmailToken,
      verifyEmailExpires,
      user: userId,
    });
    await newData.save();
    verifyEmailToken = `${verifyEmailToken}.${userId}`;
    return verifyEmailToken;
  } catch (error) {
    console.log(error);
  }
};
