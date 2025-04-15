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
    if (url.includes('//')) {
      return url;
    }
    return 'http://' + url;
  } catch (_) {
    return 'http://' + url;
  }
};

export async function getPublicIP() {
  try {
    // 使用 ipapi.co 或 ip-api.com，这两个在国内都可以访问
    const response = await fetch('http://ip-api.com/json/');
    const data = await response.json();
    return data.query; // ip-api.com 返回的IP字段名为query
  } catch (error) {
    console.error('获取公网IP失败:', error);
    throw error;
  }
}

export async function getDomainIP(domain: string) {
  try {
    // 从URL中提取域名
    const hostname = new URL(domain).hostname;
    // 使用 ip-api.com 的域名解析服务
    const response = await fetch(`http://ip-api.com/json/${hostname}`);
    const data = await response.json();
    return data.query;
  } catch (error) {
    console.error('获取域名IP失败:', error);
    throw error;
  }
}
