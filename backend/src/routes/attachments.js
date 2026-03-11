import express from 'express';
import { uploadMany } from '../middleware/upload.js';
import {
  listProjectAttachments,
  uploadProjectAttachment,
  getAttachmentMetadata,
  downloadAttachment,
  deleteAttachment,
} from '../controllers/attachmentsController.js';

const router = express.Router();

router.get('/projects/:projectId/attachments', listProjectAttachments);
router.post(
  '/projects/:projectId/attachments',
  uploadMany,
  uploadProjectAttachment
);
router.get('/attachments/:attachmentId', getAttachmentMetadata);
router.get('/attachments/:attachmentId/download', downloadAttachment);
router.delete('/attachments/:attachmentId', deleteAttachment);

export default router;
