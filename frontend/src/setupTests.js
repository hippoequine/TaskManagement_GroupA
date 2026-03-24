import React from 'react';
globalThis.React = React;

import * as matchers from '@testing-library/jest-dom/matchers';
<<<<<<< HEAD
import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
expect.extend(matchers);

afterEach(() => {
  cleanup();
});

vi.mock('@mui/icons-material', () => ({
  Edit: () => null,
  Close: () => null,
  Circle: () => null,
}));
=======
import { expect, beforeAll, afterAll } from 'vitest';
expect.extend(matchers);

const originalError = console.error;
const originalWarn = console.warn;

const shouldIgnoreMessage = (args) => {
  const text = args
    .map((arg) => (typeof arg === 'string' ? arg : String(arg)))
    .join(' ');

  return (
    text.includes('not wrapped in act') ||
    text.includes('TransitionGroup') ||
    text.includes('anchorEl') ||
    text.includes('ForwardRef')
  );
};

beforeAll(() => {
  console.error = (...args) => {
    if (shouldIgnoreMessage(args)) return;
    originalError(...args);
  };

  console.warn = (...args) => {
    if (shouldIgnoreMessage(args)) return;
    originalWarn(...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
>>>>>>> 33525af2e71e1cf8b6889cd21b51af7244019e6f
