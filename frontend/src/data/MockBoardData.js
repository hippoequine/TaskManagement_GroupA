// Task types for hierarchy distinction
export const TASK_TYPES = {
  EPIC: 'epic', // Magenta circle
  STORY: 'story', // Cyan pentagon
  SUBTASK: 'subtask', // Yellow rhombus
};

// Status columns
export const STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
};

// Column configuration
export const columns = [
  { id: STATUSES.TODO, title: 'To Do' },
  { id: STATUSES.IN_PROGRESS, title: 'In Progress' },
  { id: STATUSES.IN_REVIEW, title: 'In Review' },
  { id: STATUSES.DONE, title: 'Done' },
];

// Mock board metadata
export const boardInfo = {
  title: 'VR App Board',
  projectKey: 'VAB',
};

// Mock tasks matching the wireframe
export const tasks = [
  // To Do column
  {
    id: 'VAB-29',
    title: 'Haptic Feedback Prototyping',
    description:
      'Developing tactile response patterns for interaction controllers and sensory modules.',
    type: TASK_TYPES.EPIC,
    storyPoints: 8,
    status: STATUSES.TODO,
    assignee: 'Dev 1',
  },
  {
    id: 'VAB-31',
    title: 'Gaze-based Navigation',
    description:
      'Implementing eye-tracking interaction models for menu traversal and object selection.',
    type: TASK_TYPES.STORY,
    storyPoints: 5,
    status: STATUSES.TODO,
    assignee: 'Dev 2',
  },
  {
    id: 'VAB-08',
    title: 'Field of View Optimization',
    description:
      'Fine-tuning render distances and peripheral visibility settings for optimal performance.',
    type: TASK_TYPES.SUBTASK,
    storyPoints: 3,
    status: STATUSES.TODO,
    assignee: 'Dev 3',
  },
  {
    id: 'VAB-22',
    title: 'Guardian System Bounds',
    description:
      'Validating safety perimeter rendering and collision detection for room-scale experiences.',
    type: TASK_TYPES.STORY,
    storyPoints: 5,
    status: STATUSES.TODO,
    assignee: 'Dev 1',
  },

  // In Progress column
  {
    id: 'VAB-12',
    title: 'Spatial Audio Integration',
    description:
      'Implementing immersive soundscapes and directional audio positioning for virtual environments.',
    type: TASK_TYPES.STORY,
    storyPoints: 5,
    status: STATUSES.IN_PROGRESS,
    assignee: 'Dev 2',
  },
  {
    id: 'VAB-15',
    title: 'Stereoscopic Pipeline',
    description:
      'Optimizing dual-camera rendering pass for consistent high-framerate depth perception.',
    type: TASK_TYPES.EPIC,
    storyPoints: 13,
    status: STATUSES.IN_PROGRESS,
    assignee: 'Dev 3',
  },

  // In Review column
  {
    id: 'VAB-45',
    title: 'Tracking Calibration',
    description:
      'Aligning external sensor inputs with virtual coordinate systems for accurate motion.',
    type: TASK_TYPES.EPIC,
    storyPoints: 13,
    status: STATUSES.IN_REVIEW,
    assignee: 'Dev 1',
  },

  // Done column
  {
    id: 'VAB-05',
    title: 'Shader Pre-caching',
    description:
      'Compiling core material shaders at startup to prevent frame-stutter during gameplay.',
    type: TASK_TYPES.SUBTASK,
    storyPoints: 2,
    status: STATUSES.DONE,
    assignee: 'Dev 2',
  },
];
