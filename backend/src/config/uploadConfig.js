import fs from 'fs';
import path from 'path';

export function getUploadBase() {
  const fromEnv = process.env.UPLOAD_DIR?.trim();
  const uploadBase = fromEnv ? path.resolve(fromEnv) : path.resolve('uploads');
  fs.mkdirSync(uploadBase, { recursive: true });
  return uploadBase;
}
