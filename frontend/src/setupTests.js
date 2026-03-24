import * as matchers from '@testing-library/jest-dom/matchers';
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
