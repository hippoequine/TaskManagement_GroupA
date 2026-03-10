import api from './axios';

/**
 * Attachment API helpers.
 * All methods return the backend payload's `data` field when available.
 */
export const attachmentsApi = {
  // List attachments for one project.
  listByProject: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/attachments`);
    return res.data?.data ?? [];
  },

  // Upload one or more files to a project (multipart field name: "file").
  uploadToProject: async (projectId, files) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('file', file);
    }

    const res = await api.post(`/projects/${projectId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data ?? [];
  },

  // Get metadata for one attachment.
  getById: async (attachmentId) => {
    const res = await api.get(`/attachments/${attachmentId}`);
    return res.data?.data;
  },

  // Download one attachment.
  downloadById: async (attachmentId) => {
    const res = await api.get(`/attachments/${attachmentId}/download`, {
      responseType: 'blob', //Binary Large Object
    });
    return res.data;
  },

  // Delete one attachment.
  deleteById: async (attachmentId) => {
    await api.delete(`/attachments/${attachmentId}`);
  },
};
