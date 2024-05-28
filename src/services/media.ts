import { readFile, readFileSync, writeFileSync } from 'fs';
import path from 'path';

export interface ISearchIcon {
  q: string;
}

class MediaService {
  mediaDBPath = path.join(process.cwd(), 'public', 'media', 'imgs');

  searchIcon = (payload: ISearchIcon) => {
    return fetch(
      `https://yesicon.app/api/search?page=1&size=200&cate&style&collection&q=${payload.q}&locale=zh-hans&omit=1`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      }
    ).then((res) => res.json());
  };
}

export default new MediaService();
