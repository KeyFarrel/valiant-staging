export const createRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  currentRoute: { value: {} },
}));

export const createWebHistory = jest.fn();  // Mock createWebHistory as a function
