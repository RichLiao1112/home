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
  private mediaCustomPath = path.join(
    this.basePath,
    'public',
    'custom'
  );
  private _mediaAssetsPathWrite = path.join(this.basePath, 'assets');
  private _mediaAssetsPathRead = '/assets/';
  private mediaPngList: IMediaSource[] = [];
  private mediaSvgList: IMediaSource[] = [];
  private mediaCustomList: IMediaSource[] = [];
  private mediaAssetsList: IMediaSource[] = [];

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
      if (!existsSync(this._mediaAssetsPathWrite)) {
        mkdirSync(this._mediaAssetsPathWrite, { recursive: true });
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

  get getAssetsList() {
    return this.mediaAssetsList;
  }

  get getCustomList() {
    return this.mediaCustomList;
  }

  get mediaAssetsPath() {
    return this._mediaAssetsPathWrite;
  }

  get mediaAssetsPathRead() {
    return this._mediaAssetsPathRead;
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
      media.path.toLowerCase().includes(payload.q.toLowerCase())
    );
    const svgs = this.mediaSvgList.filter((media) =>
      media.path.toLowerCase().includes(payload.q.toLowerCase())
    );
    const custom = this.mediaCustomList.filter((media) =>
      media.path.toLowerCase().includes(payload.q.toLowerCase())
    );
    const assets = this.mediaAssetsList.filter((media) =>
      media.path.toLowerCase().includes(payload.q.toLowerCase())
    );
    return [...custom, ...assets, ...pngs, ...svgs];
  };

  readMediaFiles = (path: string) => {
    const files = readdirSync(path, {
      withFileTypes: true,
    });
    return files;
  };

  scanAllMedia = () => {
    this.scanAssetsMedia();
    this.mediaPngList = this.readMediaFiles(this.mediaPngPath).map((f) => ({
      name: f.name,
      path: `/media/imgs/png/${f.name}`,
    }));
    this.mediaSvgList = this.readMediaFiles(this.mediaSvgPath).map((f) => ({
      name: f.name,
      path: `/media/imgs/svg/${f.name}`,
    }));
    this.mediaCustomList = this.readMediaFiles(this.mediaCustomPath).map((f) => ({
      name: f.name,
      path: `/custom/${f.name}`,
    }));
  };

  scanAssetsMedia = () => {
    this.mediaAssetsList = this.readMediaFiles(this._mediaAssetsPathWrite).map(
      (f) => ({
        name: f.name,
        path: `${this.mediaAssetsPathRead}${f.name}`,
      })
    );
  };
}

export default MediaService.getInstance();
