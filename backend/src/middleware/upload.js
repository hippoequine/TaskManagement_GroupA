import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || path.resolve('uploads');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { projectId } = req.params;
    const dir = path.join(uploadDir, 'project', projectId || 'unscoped');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safeOriginal = path.basename(file.originalname).replace(/\s+/g, '_');
    const unique = cryptoRandomString();
    cb(null, `${unique}_${safeOriginal}`);
  },
});

function cryptoRandomString() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const uploader = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

export const uploadSingle = uploader.single('file');
export const uploadMany = uploader.array('file', 10);
