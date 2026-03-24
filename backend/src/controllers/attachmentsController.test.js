import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../models/Attachment.js', () => ({
  default: {
    findByPk: vi.fn(),
  },
}));

vi.mock('../models/AttachmentProject.js', () => ({
  default: {
    findAll: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock('../models/Project.js', () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock('../config/db.js', () => ({
  default: {
    transaction: vi.fn(),
  },
}));

import Attachment from '../models/Attachment.js';
import AttachmentProject from '../models/AttachmentProject.js';
import Project from '../models/Project.js';
import {
  getAttachmentMetadata,
  listProjectAttachments,
} from './attachmentsController.js';

function createRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
}

describe('attachmentsController access control', () => {
  const projectId = 'project-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists attachments when the user owns the project', async () => {
    const req = {
      params: { projectId },
      user: { sub: 'user-1' },
    };
    const res = createRes();
    const next = vi.fn();

    Project.findOne.mockResolvedValue({ id: projectId });
    AttachmentProject.findAll.mockResolvedValue([
      { attachment: { id: 'attachment-1', filename: 'notes.txt' } },
    ]);

    await listProjectAttachments(req, res, next);

    expect(Project.findOne).toHaveBeenCalledWith({
      where: { id: projectId, owner_id: 'user-1' },
      attributes: ['id'],
    });
    expect(res.json).toHaveBeenCalledWith({
      data: [{ id: 'attachment-1', filename: 'notes.txt' }],
    });
  });

  it('blocks listing attachments when the user does not own the project', async () => {
    const req = {
      params: { projectId },
      user: { sub: 'user-2' },
    };
    const res = createRes();
    const next = vi.fn();

    Project.findOne.mockResolvedValue(null);

    await listProjectAttachments(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    expect(AttachmentProject.findAll).not.toHaveBeenCalled();
  });

  it('blocks attachment metadata when the user does not own the linked project', async () => {
    const req = {
      params: { attachmentId: 'attachment-1' },
      user: { sub: 'user-2' },
    };
    const res = createRes();
    const next = vi.fn();

    Attachment.findByPk.mockResolvedValue({
      id: 'attachment-1',
      uploadedBy: 'user-1',
    });
    AttachmentProject.findOne.mockResolvedValue({ projectId });
    Project.findOne.mockResolvedValue(null);

    await getAttachmentMetadata(req, res, next);

    expect(Project.findOne).toHaveBeenCalledWith({
      where: { id: projectId, owner_id: 'user-2' },
      attributes: ['id'],
    });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
  });
});
