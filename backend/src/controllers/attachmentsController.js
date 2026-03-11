import fs from 'fs/promises';
import path from 'path';
import Attachment from '../models/Attachment.js';
import AttachmentProject from '../models/AttachmentProject.js';
import sequelize from '../config/db.js';
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

function hasAuthenticatedUser(req) {
  return Boolean(req.user?.sub);
}

function isAdmin(req) {
  return Array.isArray(req.user?.roles) && req.user.roles.includes('admin');
}

async function canAccessAttachment(req, attachment) {
  if (!hasAuthenticatedUser(req)) return false;
  if (isAdmin(req)) return true;
  return attachment.uploadedBy === req.user.sub;
}

export async function listProjectAttachments(req, res, next) {
  try {
    const { projectId } = req.params;

    if (!hasAuthenticatedUser(req)) {
      return res.status(401).json({ message: 'Login required' });
    }

    const links = await AttachmentProject.findAll({
      where: { projectId },
      include: [{ model: Attachment, as: 'attachment' }],
      order: [
        [{ model: Attachment, as: 'attachment' }, 'createdAtUTC', 'DESC'],
      ],
    });

    const attachments = links.map((link) => link.attachment).filter(Boolean);

    res.json({ data: attachments });
  } catch (err) {
    next(err);
  }
}

export async function uploadProjectAttachment(req, res, next) {
  const files = Array.isArray(req.files)
    ? req.files
    : req.file
      ? [req.file]
      : [];

  const cleanupPaths = async (paths) => {
    await Promise.all(
      paths.map(async (filePath) => {
        if (!filePath) return;
        await fs.unlink(filePath).catch(() => {});
      })
    );
  };

  let transaction;
  const movedFinalPaths = [];
  const pendingTempPaths = files.map((file) => file.path).filter(Boolean);

  try {
    const { projectId } = req.params;
    if (files.length === 0) {
      return res
        .status(400)
        .json({ message: 'No file uploaded (field name must be "file")' });
    }

    const uploadedBy = req.user?.sub;
    if (!uploadedBy) return res.status(401).json({ message: 'Login required' });

    transaction = await sequelize.transaction();

    const created = [];
    for (const file of files) {
      const mimeType = file.mimetype;
      const attachment = await Attachment.create(
        {
          uploadedBy,
          filename: file.originalname,
          mimeType,
          size: file.size,
          type: mapAttachmentType(mimeType),
          hasInlinePreview: hasInlinePreview(mimeType),
          createdAtUTC: new Date(),
          url: 'PENDING',
        },
        { transaction }
      );

      await AttachmentProject.create(
        {
          attachmentId: attachment.id,
          projectId,
        },
        { transaction }
      );

      const uploadBase = getUploadBase();
      const relativeFinal = path.join('project', projectId, attachment.id);
      const finalDir = safeResolve(uploadBase, path.dirname(relativeFinal));
      await fs.mkdir(finalDir, { recursive: true });
      const finalPath = safeResolve(uploadBase, relativeFinal);
      await fs.rename(file.path, finalPath);
      movedFinalPaths.push(finalPath);

      const tempIndex = pendingTempPaths.indexOf(file.path);
      if (tempIndex >= 0) pendingTempPaths.splice(tempIndex, 1);

      attachment.url = relativeFinal.replaceAll('\\', '/');
      await attachment.save({ transaction });
      created.push(attachment);
    }

    await transaction.commit();
    res.status(201).json({ data: created });
  } catch (err) {
    if (transaction) {
      await transaction.rollback().catch(() => {});
    }
    await cleanupPaths(movedFinalPaths);
    await cleanupPaths(pendingTempPaths);
    next(err);
  }
}

export async function getAttachmentMetadata(req, res, next) {
  try {
    const { attachmentId } = req.params;

    const attachment = await Attachment.findByPk(attachmentId);
    if (!attachment)
      return res.status(404).json({ message: 'Attachment not found' });

    const projectLink = await AttachmentProject.findOne({
      where: { attachmentId: attachment.id },
      attributes: ['projectId'],
    });
    if (!projectLink) {
      return res
        .status(404)
        .json({ message: 'Attachment project link not found' });
    }

    const allowed = await canAccessAttachment(req, attachment);
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

    const projectLink = await AttachmentProject.findOne({
      where: { attachmentId: attachment.id },
      attributes: ['projectId'],
    });
    if (!projectLink) {
      return res
        .status(404)
        .json({ message: 'Attachment project link not found' });
    }

    const allowed = await canAccessAttachment(req, attachment);
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

    const projectLink = await AttachmentProject.findOne({
      where: { attachmentId: attachment.id },
      attributes: ['projectId'],
    });
    if (!projectLink) {
      return res
        .status(404)
        .json({ message: 'Attachment project link not found' });
    }

    const allowed = await canAccessAttachment(req, attachment);
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
