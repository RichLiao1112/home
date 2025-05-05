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
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.ip; // ipapi.co 返回的IP字段名为ip
  } catch (error) {
    console.error('获取公网IP失败:', error);
    throw error;
  }
}

export async function getDomainIP(domain: string) {
  try {
    // 从URL中提取域名
    const hostname = new URL(domain).hostname;
    // 使用 ipapi.co 的域名解析服务
    const response = await fetch(`https://ipapi.co/${hostname}/json/`);
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('获取域名IP失败:', error);
    throw error;
  }
}

// 判断是否为内网IP地址
export function isPrivateIP(ip: string): boolean {
  // 移除端口号
  ip = ip.split(':')[0];

  // localhost
  if (ip === '127.0.0.1' || ip === 'localhost') return true;
  
  // 检查IP格式是否正确
  const parts = ip.split('.');
  console.log('[parts]', parts, ip)
  if (parts.length !== 4) return false;

  // 转换为数字
  const bytes = parts.map((part) => parseInt(part, 10));
  if (bytes.some((part) => isNaN(part) || part < 0 || part > 255)) return false;

  // 判断是否为内网IP范围
  // 10.0.0.0 - 10.255.255.255
  if (bytes[0] === 10) return true;

  // 172.16.0.0 - 172.31.255.255
  if (bytes[0] === 172 && bytes[1] >= 16 && bytes[1] <= 31) return true;

  // 192.168.0.0 - 192.168.255.255
  if (bytes[0] === 192 && bytes[1] === 168) return true;

  return false;
}

// 从URL中提取主机地址（支持IP:PORT格式）
export function extractHost(url: string): string {
  try {
    // 确保URL有协议前缀
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    const urlObj = new URL(url);
    return urlObj.host; // host 包含主机名和端口（如果有的话）
  } catch (error) {
    console.error('URL解析失败:', error);
    return '';
  }
}
