import { useEffect, useState } from 'react';

/**
 * A custom hook for managing inline editing state for text inputs.
 * It synchronizes local state with a server-provided value, handles auto-saving
 * on blur or "Enter" keypress, and supports cancelling edits via "Escape".
 *
 * @param {string|null|undefined} serverValue - The current value from the source of truth (API/Context).
 * @param {Function} onSave - Callback function triggered when a change is committed.
 * Receives the updated string as an argument.
 * * @returns {Object} An object containing props to spread onto an input or textarea:
 * @returns {string} value - The current local state of the input.
 * @returns {Function} onChange - Updates the local state as the user types.
 * @returns {Function} onBlur - Commits the change when the input loses focus.
 * @returns {Function} onKeyDown - Handles "Enter" (save), "Escape" (cancel), and prevents event bubbling.
 * @returns {Function} onPointerDown - Prevents event propagation to avoid triggering parent drag/click events.
 * @returns {Function} onClick - Prevents click propagation to keep focus locked on the input.
 */
export function useInlineEdit(serverValue, onSave) {
  const [value, setValue] = useState(serverValue ?? '');

  useEffect(() => {
    setValue(serverValue ?? '');
  }, [serverValue]);

  const handleSave = () => {
    if (value === serverValue) return;
    onSave(value);
  };

  return {
    value,
    onChange: (e) => setValue(e.target.value),
    onBlur: handleSave,
    onKeyDown: (e) => {
      if (e.key === 'Enter') {
        handleSave();
        e.target.blur();
      }
      if (e.key === 'Escape') {
        setValue(serverValue ?? '');
        e.target.blur();
      }
      e.stopPropagation();
    },
    onPointerDown: (e) => e.stopPropagation(),
    onClick: (e) => e.stopPropagation(),
  };
}
