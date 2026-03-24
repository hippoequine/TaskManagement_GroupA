import { describe, it, expect } from 'vitest';
import { mapAttachmentType, hasInlinePreview } from './attachmentType.js';

describe('mapAttachmentType', () => {
  it('returns OTHER when mimeType is missing', () => {
    expect(mapAttachmentType()).toBe('OTHER');
  });

  it('detects IMAGE types', () => {
    expect(mapAttachmentType('image/png')).toBe('IMAGE');
  });

  it('detects VIDEO types', () => {
    expect(mapAttachmentType('video/mp4')).toBe('VIDEO');
  });

  it('detects PDF as DOCUMENT', () => {
    expect(mapAttachmentType('application/pdf')).toBe('DOCUMENT');
  });

  it('detects text types as DOCUMENT', () => {
    expect(mapAttachmentType('text/plain')).toBe('DOCUMENT');
  });

  it('detects office documents', () => {
    expect(
      mapAttachmentType(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
    ).toBe('DOCUMENT');
  });

  it('detects msword', () => {
    expect(mapAttachmentType('application/msword')).toBe('DOCUMENT');
  });

  it('returns OTHER for unknown types', () => {
    expect(mapAttachmentType('application/zip')).toBe('OTHER');
  });
});

describe('hasInlinePreview', () => {
  it('returns true for images', () => {
    expect(hasInlinePreview('image/png')).toBe(true);
  });

  it('returns true for pdf', () => {
    expect(hasInlinePreview('application/pdf')).toBe(true);
  });

  it('returns true for text', () => {
    expect(hasInlinePreview('text/plain')).toBe(true);
  });

  it('returns false for others', () => {
    expect(hasInlinePreview('video/mp4')).toBe(false);
  });

  it('handles undefined safely', () => {
    expect(hasInlinePreview(undefined)).toBeUndefined();
  });
});
