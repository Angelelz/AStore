import multer from "multer";
import crypto from "crypto";

const upload = multer({
  storage: multer.diskStorage({
    destination: "product-data/images",
    filename(req, file, callback) {
      callback(null, crypto.randomUUID() + "-" + file.originalname);
    },
  }),
});

export const configuredMulterMiddleware = upload.single("image");
