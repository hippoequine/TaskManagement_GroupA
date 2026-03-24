import * as React from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { useParams } from 'react-router';
import { attachmentsApi } from '../api/attachmentsApi';
import { formatDateTime } from '../utils/dateTime';

function formatBytes(size) {
  if (!Number.isFinite(size) || size < 0) return '-';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatAttachmentName(filename = '') {
  if (!filename || !/[ÃÂâð]/.test(filename)) return filename;

  try {
    const bytes = Uint8Array.from(filename, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    return decoded.includes('\uFFFD') ? filename : decoded;
  } catch {
    return filename;
  }
}

function getFileExtension(filename = '') {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return filename.slice(lastDotIndex + 1).toLowerCase();
}

function getPreviewType(attachment = {}) {
  const mimeType = attachment.mimeType || '';
  const extension = getFileExtension(attachment.filename || '');

  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('text/')) return 'text';

  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
    return 'image';
  }
  if (extension === 'pdf') return 'pdf';
  if (['txt', 'md', 'csv', 'log', 'json'].includes(extension)) return 'text';
  if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) return 'video';

  return 'unsupported';
}

function Attachment({ projectId: propProjectId }) {
  const { useEffect, useMemo, useRef, useState } = React;
  const params = useParams();
  const projectId = propProjectId || params.projectId;

  const [attachments, setAttachments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [previewTarget, setPreviewTarget] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [previewType, setPreviewType] = useState('unsupported');
  const [previewLoading, setPreviewLoading] = useState(false);

  const fileInputRef = useRef(null);
  const previewObjectUrlRef = useRef('');

  const canUpload = useMemo(
    () => Boolean(projectId) && selectedFiles.length > 0 && !uploading,
    [projectId, selectedFiles, uploading]
  );

  const loadAttachments = async () => {
    if (!projectId) {
      setAttachments([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await attachmentsApi.listByProject(projectId);
      setAttachments(Array.isArray(data) ? data : []);
    } catch {
      setAttachments([]);
      setError('Failed to load attachments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttachments();
  }, [projectId]);

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!success) return undefined;

    const timeoutId = window.setTimeout(() => {
      setSuccess('');
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [success]);

  const handleSelectFiles = (event) => {
    const files = Array.from(event.target.files ?? []);
    setSelectedFiles(files);
    setSuccess('');
    setError('');
  };

  const handleUpload = async () => {
    if (!canUpload) return;

    setUploading(true);
    setError('');
    setSuccess('');
    try {
      await attachmentsApi.uploadToProject(projectId, selectedFiles);
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadAttachments();
      setSuccess('Attachment upload complete.');
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (attachment) => {
    setError('');
    try {
      const blob = await attachmentsApi.downloadById(attachment.id);
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = formatAttachmentName(attachment.filename) || 'attachment';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(href);
    } catch {
      setError('Download failed.');
    }
  };

  const closePreview = () => {
    setPreviewTarget(null);
    setPreviewLoading(false);
    setPreviewUrl('');
    setPreviewText('');
    setPreviewType('unsupported');
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = '';
    }
  };

  const openPreview = async (attachment) => {
    closePreview();
    setPreviewTarget(attachment);

    const attachmentPreviewType = getPreviewType(attachment);
    setPreviewType(attachmentPreviewType);

    if (attachmentPreviewType === 'unsupported') {
      return;
    }

    setPreviewLoading(true);
    try {
      const blob = await attachmentsApi.downloadById(attachment.id);

      if (attachmentPreviewType === 'text') {
        setPreviewText(await blob.text());
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      previewObjectUrlRef.current = objectUrl;
      setPreviewUrl(objectUrl);
    } catch {
      setError('Unable to open inline preview.');
      setPreviewType('unsupported');
    } finally {
      setPreviewLoading(false);
    }
  };

  const askDelete = (attachment) => {
    setDeleteTarget(attachment);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);
    setError('');
    try {
      await attachmentsApi.deleteById(deleteTarget.id);
      setAttachments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setSuccess('Attachment deleted.');
    } catch {
      setError('Delete failed.');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  if (!projectId) {
    return null;
  }

  return (
    <Box sx={{ py: 1 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Attachments</Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Existing Attachments
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">Loading...</Typography>
            </Box>
          ) : attachments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No attachments for this project yet.
            </Typography>
          ) : (
            <List disablePadding>
              {attachments.map((attachment) => (
                <ListItem
                  key={attachment.id}
                  divider
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => openPreview(attachment)}
                        aria-label={`view ${formatAttachmentName(attachment.filename)}`}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(attachment)}
                        aria-label={`download ${formatAttachmentName(attachment.filename)}`}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => askDelete(attachment)}
                        disabled={deletingId === attachment.id}
                        aria-label={`delete ${formatAttachmentName(attachment.filename)}`}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  }
                  sx={{ pl: 0 }}
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <InsertDriveFileOutlinedIcon fontSize="small" />
                        <Typography
                          variant="body2"
                          noWrap
                          title={formatAttachmentName(attachment.filename)}
                        >
                          {formatAttachmentName(attachment.filename)}
                        </Typography>
                        <Chip
                          size="small"
                          label={formatBytes(attachment.size)}
                        />
                      </Stack>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Uploaded {formatDateTime(attachment.createdAtUTC)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Upload New Attachments
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems="center"
          >
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              disabled={!projectId || uploading}
            >
              Choose Files
              <input
                ref={fileInputRef}
                type="file"
                hidden
                multiple
                onChange={handleSelectFiles}
              />
            </Button>

            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!canUpload}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>

            {!projectId && (
              <Typography variant="caption" color="text.secondary">
                Select a project before uploading.
              </Typography>
            )}
          </Stack>

          {selectedFiles.length > 0 && (
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {selectedFiles.map((file) => (
                <Typography key={`${file.name}-${file.size}`} variant="caption">
                  {file.name} ({formatBytes(file.size)})
                </Typography>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Delete Attachment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete &quot;{formatAttachmentName(deleteTarget?.filename)}&quot;?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            color="error"
            onClick={confirmDelete}
            disabled={Boolean(deletingId)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(previewTarget)}
        onClose={closePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {formatAttachmentName(previewTarget?.filename) ||
            'Attachment Preview'}
        </DialogTitle>
        <DialogContent>
          {previewLoading ? (
            <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : previewType === 'image' && previewUrl ? (
            <Box
              component="img"
              src={previewUrl}
              alt={formatAttachmentName(previewTarget?.filename) || 'preview'}
              sx={{ width: '100%', maxHeight: 520, objectFit: 'contain' }}
            />
          ) : previewType === 'pdf' && previewUrl ? (
            <Box
              component="iframe"
              src={previewUrl}
              title={
                formatAttachmentName(previewTarget?.filename) || 'PDF preview'
              }
              sx={{ width: '100%', height: 520, border: 0 }}
            />
          ) : previewType === 'video' && previewUrl ? (
            <Box
              component="video"
              src={previewUrl}
              controls
              sx={{ width: '100%', maxHeight: 520 }}
            />
          ) : previewType === 'text' ? (
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                maxHeight: 520,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                bgcolor: 'grey.100',
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            >
              {previewText}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              This file type cannot be previewed inline yet. Images, PDFs,
              videos, and plain text files are supported. Word documents still
              need a dedicated viewer or conversion step.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Attachment;
