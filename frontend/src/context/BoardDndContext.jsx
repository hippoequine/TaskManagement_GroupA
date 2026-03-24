import { createContext, useContext, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import { useIssues } from './IssuesContext.jsx';
import IssueCard from '../components/issue-card/IssueCard.jsx';

const BoardDndContext = createContext(null);

// Workflow validation rules (mirrors backend WorkflowService.js)
const allowedTransitions = {
  backlog: ['in_progress'],
  in_progress: ['reviewed', 'backlog'],
  reviewed: ['done', 'in_progress'],
  done: ['reviewed', 'archived'],
  archived: [],
};

// Check if a status transition is valid
export const isValidTransition = (fromStatus, toStatus) => {
  if (fromStatus === toStatus) return true; // Same column is always valid
  return allowedTransitions[fromStatus]?.includes(toStatus) ?? false;
};

// Provider component that wraps the board w/ drag-n-drop functionality
export function BoardDndProvider({ children }) {
  const { issues, moveIssue, reorderIssues } = useIssues();
  const [activeIssue, setActiveIssue] = useState(null);

  // Configures sensors w/ activation constraint to prevent accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handler when drag starts, stores active issue for overlay
  const handleDragStart = (event) => {
    const { active } = event;
    const issue = issues.find((t) => t.id === active.id);
    setActiveIssue(issue || null);
  };

  // Handler when drag ends, updates issue status or reorders within column
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveIssue(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const draggedIssue = issues.find((i) => i.id === activeId);
    if (!draggedIssue) return;

    const overIssue = issues.find((i) => i.id === overId);

    if (overIssue) {
      if (draggedIssue.status === overIssue.status) {
        // Same column: reorder
        const columnIssues = issues.filter(
          (i) => i.status === draggedIssue.status
        );
        const oldIndex = columnIssues.findIndex((i) => i.id === activeId);
        const newIndex = columnIssues.findIndex((i) => i.id === overId);

        if (oldIndex !== newIndex) {
          reorderIssues(draggedIssue.status, oldIndex, newIndex);
        }
      } else {
        // Check workflow validity before moving
        if (!isValidTransition(draggedIssue.status, overIssue.status)) {
          return; // Don't move if invalid transition
        }

        // Calculate position at drop time for cross-column moves
        const targetColumnIssues = issues.filter(
          (i) => i.status === overIssue.status
        );
        let targetIndex = targetColumnIssues.findIndex((i) => i.id === overId);

        if (over.rect && active.rect.current.translated) {
          const overCenterY = over.rect.top + over.rect.height / 2;
          const pointerY =
            active.rect.current.translated?.top +
            active.rect.current.translated?.height / 2;

          if (pointerY > overCenterY) {
            targetIndex += 1; // Insert after the target card
          }
        }

        moveIssue(activeId, overIssue.status, targetIndex);
      }
    } else {
      // Dropped over empty column area
      const columnIds = [
        'backlog',
        'in_progress',
        'reviewed',
        'done',
        'archived',
      ];
      if (columnIds.includes(overId) && draggedIssue.status !== overId) {
        // Check workflow validity before moving
        if (!isValidTransition(draggedIssue.status, overId)) {
          return; // Don't move if invalid transition
        }
        moveIssue(activeId, overId);
      }
    }
  };

  return (
    <BoardDndContext.Provider value={{ activeIssue }}>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {children}
        {/* Renders the dragged card outside normal flow */}
        <DragOverlay>
          {activeIssue ? <IssueCard issue={activeIssue} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </BoardDndContext.Provider>
  );
}

// Hook to access DnD context state
export const useBoardDnd = () => useContext(BoardDndContext);
