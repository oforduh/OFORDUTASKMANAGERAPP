import { v2 as cloudinary } from "cloudinary";
import path from "path";
import Datauri from "datauri";

export const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploader = (req) => {
  return new Promise((resolve, reject) => {
    const dUri = new Datauri();
    let image = dUri.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    );
    cloudinary.uploader.upload(image.content, (err, url) => {
      if (err) return reject(err);
      return resolve(url);
    });
  });
};
