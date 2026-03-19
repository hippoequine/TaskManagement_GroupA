import api from './axios';

/**
 * API service for managing Project resources.
 * * Provides methods to interact with the project-related endpoints.
 */
export const projectsApi = {
  /**
   * Retrieves all projects for the authenticated user.
   * Supports optional pagination via query params.
   * @param {{ page?: number, limit?: number }} [params]
   * @returns {Promise<{ data: { total: number, page: number, projects: Project[] } }>}
   * @example
   * const { data } = await projectsApi.getAll();
   * const projects = data.projects;
   */
  getAll: (params) => api.get('/projects', { params }),

  /**
   * Retrieves a single project by ID.
   * @param {number} id
   * @returns {Promise<{ data: Project }>}
   * @example
   * const { data } = await projectsApi.getById(3);
   */
  getById: (id) => api.get(`/projects/${id}`),

  /**
   * Creates a new project.
   * @param {{ name: string, description?: string }} payload
   * @returns {Promise<{ data: Project }>}
   * @example
   * const { data } = await projectsApi.create({ name: 'My App' });
   */
  create: (payload) => api.post('/projects', payload),

  /**
   * Updates an existing project by ID.
   * @param {number} id
   * @param {{ name?: string, key?: string, description?: string, category?: string }} payload
   * @returns {Promise<{ data: Project }>}
   */
  update: (id, payload) => api.put(`/projects/${id}`, payload),
};
