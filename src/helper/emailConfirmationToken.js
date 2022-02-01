import verificationEmailTokenModel from "../model/veificationEmailToken.js";

import crypto from "crypto";
export const generateConfirmationToken = async (user) => {
  const verifyEmailToken = crypto.randomBytes(20).toString("hex");
  const verifyEmailExpires = Date.now() + 3600000; //expires in an hour
  const userId = user._id;
  const newData = await new verificationEmailTokenModel({
    verifyEmailToken,
    verifyEmailExpires,
    user: userId,
  });
  await newData.save();
  return verifyEmailToken;
};
