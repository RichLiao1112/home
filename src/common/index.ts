import { randomUUID } from 'crypto';

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

export const maxFileSizeMB = 200; // MB
export const maxFileSize = maxFileSizeMB * 1024 * 1024;
export const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

export const genUUID = () => {
  return randomUUID();
};

export const ensureProtocol = (url: string) => {
  try {
    const parsedUrl = new URL(url); // 如果没有协议会抛出错误
    return parsedUrl.href;
  } catch (_) {
    // 默认协议为 https，如果需要使用 http 则修改为 'http://'
    return 'http://' + url;
  }
};
