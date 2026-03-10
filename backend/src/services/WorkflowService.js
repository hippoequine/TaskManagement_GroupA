const allowedTransitions = {
  backlog: ['in_progress'],
  in_progress: ['reviewed', 'backlog'],
  reviewed: ['done', 'in_progress'],
  done: ['reviewed', 'archived'],
  archived: [],
};

const getAllowedStatuses = () => {
  return Object.keys(allowedTransitions);
};

const getAllowedTransitions = (currentStatus) => {
  return allowedTransitions[currentStatus] || [];
};

const validateTransition = (currentStatus, newStatus) => {
  return allowedTransitions[currentStatus]?.includes(newStatus);
};

export { getAllowedStatuses, getAllowedTransitions, validateTransition };
