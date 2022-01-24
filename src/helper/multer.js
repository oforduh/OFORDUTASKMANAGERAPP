import multer from "multer";
export const upload = multer({
  // dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    // if (file.originalname.endsWith(".pdf")) {
    //   // return cb(new Error("Please upload a PDF"));
    //   cb(undefined, true);
    // }
    // if (!file.originalname.match(/\.(doc|docx)$/)) {
    //   return cb(new Error("Please upload a word document"));
    // }

    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an Image"));
    }
    cb(undefined, true);
    // To reject this file pass `false`, like so:
    // cb(null, false);

    // To accept the file pass `true`, like so:

    // You can always pass an error if something goes wrong:
    // cb(new Error("I don't have a clue!"));
  },
});

// for testing purposes only
export const errorMiddleware = (req, res, next) => {
  throw new Error("This is the new error");
};

export const handleErrorMiddleware = (error, req, res, next) => {
  res.status(400).send({ error: error.message });
};
