import express from 'express';
import { uploadMany } from '../middleware/upload.js';
import {
  listIssueAttachments,
  uploadIssueAttachment,
  getAttachmentMetadata,
  downloadAttachment,
  deleteAttachment,
} from '../controllers/attachmentsController.js';

const router = express.Router();

router.get('/issues/:issueId/attachments', listIssueAttachments);
router.post('/issues/:issueId/attachments', uploadMany, uploadIssueAttachment);
router.get('/attachments/:attachmentId', getAttachmentMetadata);
router.get('/attachments/:attachmentId/download', downloadAttachment);
router.delete('/attachments/:attachmentId', deleteAttachment);

export default router;
