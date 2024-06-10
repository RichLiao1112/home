import { existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';

export interface ISearchIcon {
  q: string;
}

export interface IMediaSource {
  name: string;
  path: string;
}

class MediaService {
  private static instance: MediaService;
  private basePath = process.cwd();
  private mediaPngPath = path.join(
    this.basePath,
    'public',
    'media',
    'imgs',
    'png'
  );
  private mediaSvgPath = path.join(
    this.basePath,
    'public',
    'media',
    'imgs',
    'svg'
  );
  private _mediaCustomPathWrite = path.join(this.basePath, 'assets');
  private _mediaCustomPathRead = '/api/assets/';
  private mediaPngList: IMediaSource[] = [];
  private mediaSvgList: IMediaSource[] = [];
  private mediaCustomList: IMediaSource[] = [];

  public static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  private constructor() {
    this.checkCustomDir();
    this.scanAllMedia();
  }

  private checkCustomDir() {
    try {
      if (!existsSync(this._mediaCustomPathWrite)) {
        mkdirSync(this._mediaCustomPathWrite, { recursive: true });
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  }

  get getMediaPngList() {
    return this.mediaPngList;
  }

  get getMediaSvgList() {
    return this.mediaSvgList;
  }

  get getCustomList() {
    return this.mediaCustomList;
  }

  get mediaCustomPath() {
    return this._mediaCustomPathWrite;
  }

  get mediaCustomPathRead() {
    return this._mediaCustomPathRead;
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
      media.path.includes(payload.q.toLowerCase())
    );
    const svgs = this.mediaSvgList.filter((media) =>
      media.path.includes(payload.q.toLowerCase())
    );
    const custom = this.mediaCustomList.filter((media) =>
      media.path.includes(payload.q.toLowerCase())
    );
    return [...custom, ...pngs, ...svgs];
  };

  readMediaFiles = (path: string) => {
    const files = readdirSync(path, {
      withFileTypes: true,
    });
    return files;
  };

  scanAllMedia = () => {
    this.scanCustomMedia();
    this.mediaPngList = this.readMediaFiles(this.mediaPngPath).map((f) => ({
      name: f.name,
      path: `/media/imgs/png/${f.name}`,
    }));
    this.mediaSvgList = this.readMediaFiles(this.mediaSvgPath).map((f) => ({
      name: f.name,
      path: `/media/imgs/svg/${f.name}`,
    }));
  };

  scanCustomMedia = () => {
    this.mediaCustomList = this.readMediaFiles(this._mediaCustomPathWrite).map(
      (f) => ({
        name: f.name,
        path: `${this.mediaCustomPathRead}${f.name}`,
      })
    );
  };
}

export default MediaService.getInstance();
