import { describe, it, expect, beforeEach, vi } from 'vitest';
import { store } from '@/store/index';

describe('Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    store.setLoading(false);
    store.setError(false);
    store.setTimeOut(false);
    store.setErrorMessage(null);
    store.setAddAble(false);
    store.setEditAble(false);
    store.setDeleteAble(false);
    store.setMenus({});
  });

  it('should set and get loading state', () => {
    store.setLoading(true);
    const state = store.getState();
    expect(state.loading).toBe(true);
  });

  it('should set and get error state', () => {
    store.setError(true);
    const state = store.getState();
    expect(state.error).toBe(true);
  });

  it('should set and get error message', () => {
    const testMessage = 'Test error message';
    store.setErrorMessage(testMessage);
    const state = store.getState();
    expect(state.message).toBe(testMessage);
  });

  it('should set and get timeout state', () => {
    store.setTimeOut(true);
    const state = store.getState();
    expect(state.timeOut).toBe(true);
  });

  it('should set and get message', () => {
    const testMessage = 'Test message';
    store.setMessage(testMessage);
    const state = store.getState();
    expect(state.message).toBe(testMessage);
  });

  it('should set and get menus', () => {
    const testMenus = { home: true, dashboard: false };
    const consoleSpy = vi.spyOn(console, 'log');
    
    store.setMenus(testMenus);
    const menus = store.getMenus();
    
    expect(menus).toEqual(testMenus);
    expect(consoleSpy).toHaveBeenCalledWith(testMenus);
  });

  it('should set and get addAble state', () => {
    store.setAddAble(true);
    const addAble = store.getAddAble();
    expect(addAble).toBe(true);
  });

  it('should set and get editAble state', () => {
    store.setEditAble(true);
    const editAble = store.getEditAble();
    expect(editAble).toBe(true);
  });

  it('should set and get deleteAble state', () => {
    store.setDeleteAble(true);
    const deleteAble = store.getDeleteAble();
    expect(deleteAble).toBe(true);
  });
});