export function normalizeUploadedFilename(filename = '') {
  if (!filename) return '';

  const looksMojibake = /[ÃÂâð]/.test(filename);
  if (!looksMojibake) return filename;

  const decoded = Buffer.from(filename, 'latin1').toString('utf8');
  return decoded.includes('\uFFFD') ? filename : decoded;
}
