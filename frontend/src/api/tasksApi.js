import api from './axios';

/**
 * API service for managing Task resources.
 * * Provides methods to interact with the task-related endpoints within the
 * hierarchy of projects and boards.
 */
export const tasksApi = {
  /**
   * Retrieves all tasks associated with a specific board within a project.
   * * @param {string|number} projectId - The unique identifier of the parent project.
   * @param {string|number} boardId - The unique identifier of the board.
   * @returns {Promise<Object>} A promise resolving to an array of task objects.
   * @example
   * const tasks = await tasksApi.getAll(1, 5);
   */
  getAll: (projectId, boardId) =>
    api.get(`/projects/${projectId}/boards/${boardId}/tasks`),

  /**
   * Updates specific fields of an existing task (Partial Update).
   * * Uses the PATCH method to modify only the fields provided in the `changes` object,
   * preserving other task properties.
   * * @param {string|number} projectId - The unique identifier of the parent project.
   * @param {string|number} boardId - The unique identifier of the board.
   * @param {string|number} taskId - The unique identifier of the task to be updated.
   * @param {Object} changes - The properties to update (e.g., { title: 'New Name', status: 'Done' }).
   * @returns {Promise<Object>} A promise resolving to the updated task object.
   * @example
   * await tasksApi.update(1, 5, 101, { status: 'In Progress' });
   */
  update: (projectId, boardId, taskId, changes) =>
    api.patch(
      `/projects/${projectId}/boards/${boardId}/tasks/${taskId}`,
      changes
    ),
};
