import { readdirSync } from 'fs';
import path from 'path';

export interface ISearchIcon {
  q: string;
}

export interface IMediaSource {
  name: string;
  path: string;
}

class MediaService {
  mediaPngPath = path.join(process.cwd(), 'public', 'media', 'imgs', 'png');
  mediaSvgPath = path.join(process.cwd(), 'public', 'media', 'imgs', 'svg');

  private mediaPngList: IMediaSource[] = [];
  private mediaSvgList: IMediaSource[] = [];

  constructor() {
    this.mediaPngList = this.readMediaFiles(this.mediaPngPath, 'png');
    this.mediaSvgList = this.readMediaFiles(this.mediaSvgPath, 'svg');
  }

  get getMediaPngList() {
    return this.mediaPngList;
  }

  get getMediaSvgList() {
    return this.mediaSvgList;
  }

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

  queryMedia = (payload: ISearchIcon) => {
    if (!payload.q) return [];
    const pngs = this.mediaPngList.filter((media) =>
      media.name.includes(payload.q.toLowerCase())
    );
    const svgs = this.mediaSvgList.filter((media) =>
      media.name.includes(payload.q.toLowerCase())
    );
    return [...pngs, ...svgs];
  };

  readMediaFiles = (path: string, type: 'png' | 'svg') => {
    const files = readdirSync(path, {
      withFileTypes: true,
    });
    return files.map((f) => ({
      name: f.name,
      path: `/media/imgs/${type}/${f.name}`,
    }));
  };
}

export default new MediaService();
