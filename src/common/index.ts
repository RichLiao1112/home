export const isHttpSource = (src?: string) => {
  if (
    src &&
    (src.startsWith('http://') ||
      src.startsWith('https://') ||
      src.startsWith('//'))
  ) {
    return true;
  }
  return false;
};

export const jumpModeStorageKey = 'LINK_JUMP_MODE';

export const jumpMode = {
  lan: 'lan',
  wan: 'wan',
};

export const setLinkJumpMode = (value: string) => {
  localStorage.setItem(jumpModeStorageKey, value);
};

export const getLinkJumpMode = () => {
  return localStorage.getItem(jumpModeStorageKey);
};
