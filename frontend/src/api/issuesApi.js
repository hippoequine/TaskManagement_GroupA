import api from './axios';

/**
 * API service for managing Issue resources.
 * * Provides methods to interact with the issue-related endpoints within the
 * hierarchy of projects and boards.
 */
export const issuesApi = {
  /**
   * Retrieves all issues associated with a specific board within a project.
   * @param {string|number} boardId - The unique identifier of the board.
   * @returns {Promise<Object>} A promise resolving to an array of issue objects.
   * @example
   * const issues = await issuesApi.getAll(5);
   */
  getAll: (boardId) => api.get(`/boards/${boardId}/issues`),

  /**
   * Updates specific fields of an existing issue (Partial Update).
   * * Uses the PATCH method to modify only the fields provided in the `changes` object,
   * preserving other issue properties.
   * @param {string|number} issueId - The unique identifier of the issue to be updated.
   * @param {Object} changes - The properties to update (e.g., { title: 'New Name', status: 'Done' }).
   * @returns {Promise<Object>} A promise resolving to the updated issue object.
   * @example
   * await issuesApi.update(101, { status: 'In Progress' });
   */
  update: (issueId, changes) => api.patch(`/issues/${issueId}`, changes),

  /**
   * Deletes an issue with given ID
   * @param {string|number} issueId
   * @returns void
   * @example
   * await issuesApi.delete(101);
   */
  delete: (issueId) => api.delete(`/issues/${issueId}`),

  /**
   * Retrieves all issues.
   * @returns {Promise<Object>} A promise resolving to an array of issue objects.
   * @example
   * const issues = await tasksApi.getAllIssues();
   */
  getAllIssues: () => api.get(`/issues`),
};
