// @vitest-environment jsdom

// eslint-disable-next-line no-unused-vars
import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Attachment from '../components/Attachment';
import { attachmentsApi } from '../api/attachmentsApi';

vi.mock('react-router', () => ({
  useParams: () => ({}),
}));

vi.mock('../api/attachmentsApi', () => ({
  attachmentsApi: {
    listByProject: vi.fn(),
    uploadToProject: vi.fn(),
    downloadById: vi.fn(),
    deleteById: vi.fn(),
  },
}));

describe('Attachment', () => {
  const projectId = 'project-123';
  const uploadedAttachment = {
    id: 'attachment-1',
    projectId,
    filename: 'notes.txt',
    size: 11,
    createdAtUTC: '2026-03-20T20:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('retrieves attachments for the existing project', async () => {
    attachmentsApi.listByProject.mockResolvedValueOnce([uploadedAttachment]);

    render(<Attachment projectId={projectId} />);

    await waitFor(() => {
      expect(attachmentsApi.listByProject).toHaveBeenCalledWith(projectId);
    });

    expect(screen.getAllByText('notes.txt').length).toBeGreaterThan(0);
  });

  it('uploads a selected file to the existing project', async () => {
    attachmentsApi.listByProject
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([uploadedAttachment]);
    attachmentsApi.uploadToProject.mockResolvedValue([uploadedAttachment]);

    const { container } = render(<Attachment projectId={projectId} />);

    await waitFor(() => {
      expect(attachmentsApi.listByProject).toHaveBeenCalledWith(projectId);
    });

    const fileInput = container.querySelector('input[type="file"]');
    const uploadButton = screen.getByRole('button', { name: 'Upload' });
    const file = new File(['hello world'], 'notes.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('notes.txt (11 B)')).toBeDefined();
    expect(uploadButton.hasAttribute('disabled')).toBe(false);

    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(attachmentsApi.uploadToProject).toHaveBeenCalledWith(
        projectId,
        expect.arrayContaining([expect.objectContaining({ name: 'notes.txt' })])
      );
    });

    await waitFor(() => {
      expect(screen.getAllByText('notes.txt').length).toBeGreaterThan(0);
    });
  });

  it('deletes an attachment from the existing project', async () => {
    attachmentsApi.listByProject.mockResolvedValueOnce([uploadedAttachment]);
    attachmentsApi.deleteById.mockResolvedValue();

    render(<Attachment projectId={projectId} />);

    await waitFor(() => {
      expect(attachmentsApi.listByProject).toHaveBeenCalledWith(projectId);
    });

    const deleteButton = screen.getByRole('button', {
      name: 'delete notes.txt',
    });
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(attachmentsApi.deleteById).toHaveBeenCalledWith('attachment-1');
    });

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: 'delete notes.txt' })
      ).toBeNull();
    });
  });

  it('does not fetch attachments when projectId is missing', async () => {
    render(<Attachment />);

    await waitFor(() => {
      expect(attachmentsApi.listByProject).not.toHaveBeenCalled();
    });
  });

  it('shows empty state when no attachments exist', async () => {
    attachmentsApi.listByProject.mockResolvedValueOnce([]);

    render(<Attachment projectId={projectId} />);

    await waitFor(() => {
      expect(attachmentsApi.listByProject).toHaveBeenCalledWith(projectId);
    });

    expect(screen.getByText(/no attachments/i)).toBeInTheDocument();
  });

  it('shows error when upload fails', async () => {
    attachmentsApi.listByProject.mockResolvedValueOnce([]);
    attachmentsApi.uploadToProject.mockRejectedValueOnce(
      new Error('Upload failed')
    );

    const { container } = render(<Attachment projectId={projectId} />);

    const fileInput = container.querySelector('input[type="file"]');
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    const file = new File(['hello world'], 'notes.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(uploadButton);

    expect(await screen.findByText(/upload failed/i)).toBeInTheDocument();
  });

  it('shows error when delete fails', async () => {
    attachmentsApi.listByProject.mockResolvedValueOnce([uploadedAttachment]);
    attachmentsApi.deleteById.mockRejectedValueOnce(new Error('Delete failed'));

    render(<Attachment projectId={projectId} />);

    expect(
      await screen.findByRole('button', { name: /delete notes\.txt/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /delete notes\.txt/i }));
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    expect(await screen.findByText(/delete failed/i)).toBeInTheDocument();
  });

  it('downloads an attachment', async () => {
    attachmentsApi.listByProject.mockResolvedValueOnce([uploadedAttachment]);
    attachmentsApi.downloadById.mockResolvedValueOnce(
      new Blob(['hello'], { type: 'text/plain' })
    );

    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:test');
    const revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    render(<Attachment projectId={projectId} />);

    await screen.findByText('notes.txt');

    fireEvent.click(
      screen.getByRole('button', { name: /download notes\.txt/i })
    );

    await waitFor(() => {
      expect(attachmentsApi.downloadById).toHaveBeenCalledWith('attachment-1');
    });

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('opens text preview for text attachment', async () => {
    const textAttachment = {
      ...uploadedAttachment,
      mimeType: 'text/plain',
    };

    attachmentsApi.listByProject.mockResolvedValueOnce([textAttachment]);
    attachmentsApi.downloadById.mockResolvedValueOnce(
      new Blob(['hello text'], { type: 'text/plain' })
    );

    render(<Attachment projectId={projectId} />);

    await screen.findByText('notes.txt');

    fireEvent.click(screen.getByRole('button', { name: /view notes\.txt/i }));

    expect(await screen.findByText(/hello text/i)).toBeInTheDocument();
  });

  it('shows unsupported preview message for unsupported attachment type', async () => {
    const unsupportedAttachment = {
      ...uploadedAttachment,
      filename: 'archive.zip',
      mimeType: 'application/zip',
    };

    attachmentsApi.listByProject.mockResolvedValueOnce([unsupportedAttachment]);

    render(<Attachment projectId={projectId} />);

    await screen.findByText('archive.zip');

    fireEvent.click(screen.getByRole('button', { name: /view archive\.zip/i }));

    expect(
      await screen.findByText(/cannot be previewed inline/i)
    ).toBeInTheDocument();
  });

  it('closes delete confirmation dialog without deleting', async () => {
    attachmentsApi.listByProject.mockResolvedValueOnce([uploadedAttachment]);

    render(<Attachment projectId={projectId} />);

    await screen.findByRole('button', { name: /delete notes\.txt/i });

    fireEvent.click(screen.getByRole('button', { name: /delete notes\.txt/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(attachmentsApi.deleteById).not.toHaveBeenCalled();
  });
});
