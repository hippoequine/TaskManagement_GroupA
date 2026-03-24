import React from 'react';
globalThis.React = React;

import * as matchers from '@testing-library/jest-dom/matchers';
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
