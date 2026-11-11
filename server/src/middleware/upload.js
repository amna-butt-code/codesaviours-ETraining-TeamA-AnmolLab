import multer from "multer";
import path from "path";
import fs from "fs";

const storageDir = path.resolve("storage");
fs.mkdirSync(storageDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, storageDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const allowed = new Set(["application/pdf", "image/jpeg", "image/png"]);
export const reportUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, allowed.has(file.mimetype))
}).single("report");
