import api from './axios';

/**
 * API service for managing Project resources.
 * * Provides methods to interact with the project-related endpoints.
 */
export const projectsApi = {
  /**
   * Retrieves all projects.
   * @returns {Promise<Object>} A promise resolving to an array of project objects.
   * @example
   * const projects = await projectsApi.getAll();
   */
  getAll: () => api.get('/projects'),
};
