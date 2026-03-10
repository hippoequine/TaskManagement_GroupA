import fs from 'fs/promises';
import path from 'path';
import Attachment from '../models/Attachment.js';
import Issue from '../models/Issue.js';
import IssueAssignee from '../models/IssueAssignee.js';
import {
  mapAttachmentType,
  hasInlinePreview,
} from '../../utils/attachmentType.js';
import { getUploadBase } from '../config/uploadConfig.js';

// Security: ensure storagePath is always relative and never escapes base
function safeResolve(base, relative) {
  const resolved = path.resolve(base, relative);
  const baseResolved = path.resolve(base);
  if (
    !resolved.startsWith(baseResolved + path.sep) &&
    resolved !== baseResolved
  ) {
    throw new Error('Invalid storagePath');
  }
  return resolved;
}

async function canAccessIssue(req, issue) {
  const userId = req.user?.sub;
  if (!userId) return false;

  const isAdmin =
    Array.isArray(req.user?.roles) && req.user.roles.includes('admin');
  if (isAdmin) return true;

  const isReporter = issue.reporterId === userId;
  const isAssignee = !!(await IssueAssignee.findOne({
    where: { issueId: issue.id, userId },
    attributes: ['issueId'],
  }));

  return isReporter || isAssignee;
}

async function canAccessAttachment(req, attachment, issue) {
  const userId = req.user?.sub;
  if (!userId) return false;

  const isAdmin =
    Array.isArray(req.user?.roles) && req.user.roles.includes('admin');
  if (isAdmin) return true;

  const isUploader = attachment.uploadedBy === userId;
  const canAccessParentIssue = await canAccessIssue(req, issue);
  return isUploader || canAccessParentIssue;
}

export async function listIssueAttachments(req, res, next) {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findByPk(issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const allowed = await canAccessIssue(req, issue);
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });

    const attachments = await Attachment.findAll({
      where: { issueId },
      order: [['createdAtUTC', 'DESC']],
    });

    res.json({ data: attachments });
  } catch (err) {
    next(err);
  }
}

export async function uploadIssueAttachment(req, res, next) {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findByPk(issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const files = Array.isArray(req.files)
      ? req.files
      : req.file
        ? [req.file]
        : [];
    if (files.length === 0) {
      return res
        .status(400)
        .json({ message: 'No file uploaded (field name must be "file")' });
    }

    const uploadedBy = req.user?.sub;
    if (!uploadedBy) return res.status(401).json({ message: 'Login required' });

    const created = [];
    for (const file of files) {
      const mimeType = file.mimetype;
      const attachment = await Attachment.create({
        issueId,
        uploadedBy,
        filename: file.originalname,
        mimeType,
        size: file.size,
        type: mapAttachmentType(mimeType),
        hasInlinePreview: hasInlinePreview(mimeType),
        createdAtUTC: new Date(),
        url: 'PENDING',
      });

      const uploadBase = getUploadBase();
      const relativeFinal = path.join('issue', issueId, attachment.id);
      const finalDir = safeResolve(uploadBase, path.dirname(relativeFinal));
      await fs.mkdir(finalDir, { recursive: true });
      const finalPath = safeResolve(uploadBase, relativeFinal);
      await fs.rename(file.path, finalPath);

      attachment.url = relativeFinal.replaceAll('\\', '/');
      await attachment.save();
      created.push(attachment);
    }

    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

export async function getAttachmentMetadata(req, res, next) {
  try {
    const { attachmentId } = req.params;

    const attachment = await Attachment.findByPk(attachmentId);
    if (!attachment)
      return res.status(404).json({ message: 'Attachment not found' });

    const issue = await Issue.findByPk(attachment.issueId, {
      attributes: ['id', 'reporterId'],
    });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const allowed = await canAccessAttachment(req, attachment, issue);
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });

    res.json({ data: attachment });
  } catch (err) {
    next(err);
  }
}

export async function downloadAttachment(req, res, next) {
  try {
    const { attachmentId } = req.params;

    const attachment = await Attachment.findByPk(attachmentId);
    if (!attachment)
      return res.status(404).json({ message: 'Attachment not found' });

    const issue = await Issue.findByPk(attachment.issueId, {
      attributes: ['id', 'reporterId'],
    });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const allowed = await canAccessAttachment(req, attachment, issue);
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });

    const uploadBase = getUploadBase();
    const filePath = safeResolve(uploadBase, attachment.url);

    // Set headers
    res.setHeader(
      'Content-Type',
      attachment.mimeType || 'application/octet-stream'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(attachment.filename)}"`
    );

    return res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
}

export async function deleteAttachment(req, res, next) {
  try {
    const { attachmentId } = req.params;

    const attachment = await Attachment.findByPk(attachmentId);
    if (!attachment)
      return res.status(404).json({ message: 'Attachment not found' });

    const issue = await Issue.findByPk(attachment.issueId, {
      attributes: ['id', 'reporterId'],
    });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const allowed = await canAccessAttachment(req, attachment, issue);
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });

    const uploadBase = getUploadBase();
    const filePath = safeResolve(uploadBase, attachment.url);

    await attachment.destroy();
    await fs.unlink(filePath).catch(() => {});

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
