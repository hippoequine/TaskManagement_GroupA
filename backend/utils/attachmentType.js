export function mapAttachmentType(mimeType) {
  if (!mimeType) return 'OTHER';
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (
    mimeType === 'application/pdf' ||
    mimeType.startsWith('text/') ||
    mimeType.includes('officedocument') ||
    mimeType.includes('msword')
  )
    return 'DOCUMENT';
  return 'OTHER';
}

export function hasInlinePreview(mimeType) {
  return (
    mimeType?.startsWith('image/') ||
    mimeType === 'application/pdf' ||
    mimeType?.startsWith('text/')
  );
}
