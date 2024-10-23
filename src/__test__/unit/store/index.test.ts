import { store } from '@/store/index'; // Sesuaikan path ini

describe('Store', () => {
  afterEach(() => {
    // Reset semua state di setiap test untuk menghindari interaksi antar test
    store.setLoading(false);
    store.setError(false);
    store.setTimeOut(false);
    store.setMessage(null);
    store.setMenus({});
    store.setAddAble(false);
    store.setEditAble(false);
    store.setDeleteAble(false);
  });

  it('should set loading state correctly', () => {
    store.setLoading(true);
    const state = store.getState();
    expect(state.loading).toBe(true);

    store.setLoading(false);
    const updatedState = store.getState();
    expect(updatedState.loading).toBe(false);
  });

  it('should set and get error state correctly', () => {
    store.setError(true);
    const state = store.getState();
    expect(state.error).toBe(true);

    store.setError(false);
    const updatedState = store.getState();
    expect(updatedState.error).toBe(false);
  });

  it('should set and get timeout state correctly', () => {
    store.setTimeOut(true);
    const state = store.getState();
    expect(state.timeOut).toBe(true);

    store.setTimeOut(false);
    const updatedState = store.getState();
    expect(updatedState.timeOut).toBe(false);
  });

  it('should set and get error message correctly', () => {
    store.setErrorMessage('An error occurred');
    const state = store.getState();
    expect(state.message).toBe('An error occurred');

    store.setErrorMessage(null);
    const updatedState = store.getState();
    expect(updatedState.message).toBeNull();
  });

  it('should set and get custom message correctly', () => {
    store.setMessage('Custom message');
    const state = store.getState();
    expect(state.message).toBe('Custom message');
  });

  it('should set and get menus correctly', () => {
    const testMenus = { menu1: 'Dashboard', menu2: 'Settings' };
    store.setMenus(testMenus);
    const menus = store.getMenus();
    expect(menus).toEqual(testMenus);
  });

  it('should set and get addAble state correctly', () => {
    store.setAddAble(true);
    expect(store.getAddAble()).toBe(true);

    store.setAddAble(false);
    expect(store.getAddAble()).toBe(false);
  });

  it('should set and get editAble state correctly', () => {
    store.setEditAble(true);
    expect(store.getEditAble()).toBe(true);

    store.setEditAble(false);
    expect(store.getEditAble()).toBe(false);
  });

  it('should set and get deleteAble state correctly', () => {
    store.setDeleteAble(true);
    expect(store.getDeleteAble()).toBe(true);

    store.setDeleteAble(false);
    expect(store.getDeleteAble()).toBe(false);
  });
});
