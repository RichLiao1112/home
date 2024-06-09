export interface IFile {
  filename: string;
  // type: 'default' | 'custom';
  defaultConfigKey: string;
}

export const isHttpSource = (src?: string) => {
  if (
    src &&
    (src.startsWith('http://') ||
      src.startsWith('https://') ||
      src.startsWith('//') ||
      src?.startsWith('/'))
  ) {
    return true;
  }
  return false;
};

export const jumpModeStorageKey = 'HOME_CONFIG_LINK_JUMP_MODE';

export const jumpMode = {
  lan: 'lan',
  wan: 'wan',
};

export const setLinkJumpMode = (value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(jumpModeStorageKey, value);
  }
};

export const getLinkJumpMode = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(jumpModeStorageKey);
  }
  return null;
};

export const defaultDBFile: IFile = {
  filename: 'home.json',
  defaultConfigKey: 'default',
};

export const dbSelectedStorageKey = 'HOME_CONFIG_SELECTED_KEY';

export const setSelectedKey = (value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(dbSelectedStorageKey, value);
  }
};

export const getSelectedKey = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(dbSelectedStorageKey) || 'default';
  }
  return 'default';
};
