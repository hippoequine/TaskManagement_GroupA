import api from './axios';

/**
 * API service for managing Board resources.
 * * Provides methods to interact with the board-related endpoints within the
 * hierarchy of projects.
 */
export const boardsApi = {
  /**
   * Retrieves all boards within a project.
   * * @param {string|number} projectId - The unique identifier of the parent project.
   * @returns {Promise<Object>} A promise resolving to an array of board objects.
   * @example
   * const boards = await boardsApi.getAll(1);
   */
  getAll: (projectId) => api.get(`/projects/${projectId}/boards`),

  create: (payload) => api.post('/boards', payload),
};
