import { defaultDBFile } from '@/common';
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  accessSync,
  mkdirSync,
  writeFile,
  access,
  mkdir,
  readdir,
  unlink,
  readFile,
} from 'fs';
import path from 'path';

export interface ICard {
  title: string;
  cover?: string;
  wanLink?: string;
  lanLink?: string;
  autoSelectLink?: boolean;
  openInNewWindow?: boolean;
  id?: string;
  coverColor?: string;
}

export interface IHead {
  logo?: string;
  name?: string;
  backgroundImage?: string;
  logoColor?: string;
}

export interface ICardListStyle {
  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;
}

export interface ILayout {
  cardListStyle?: ICardListStyle;
  head?: IHead;
}

export interface IHomeData {
  dataSource: ICard[];
  layout: ILayout;
}

export interface IFile {
  filename: string;
  type: 'default' | 'custom';
  basePath: string;
}

/**
 * 单例使用
 */
class HomeService {
  currentDBFile: IFile = defaultDBFile;

  private readonly sourcePath = process.cwd();

  private defaultDBPath = path.join(this.sourcePath, defaultDBFile.filename);
  _homeDBData: Partial<IHomeData> = {};

  customDBDir = path.join(this.sourcePath, 'db');
  customDBFiles: IFile[] = [];

  constructor() {
    this.readDBFileSync(this.defaultDBPath);
    this.currentDBFile = defaultDBFile;
    this.queryDBFiles(this.customDBDir, 'db');
  }

  set homeDBData(payload: Partial<IHomeData>) {
    this._homeDBData = payload;
    this.layout = this._homeDBData.layout || {};
    this.head = this._homeDBData.layout?.head || {};
    this.dataSource = this._homeDBData.dataSource || [];
  }

  get homeDBData() {
    return this._homeDBData;
  }

  set layout(payload: ILayout) {
    this.homeDBData.layout = payload;
  }

  get layout() {
    const { layout } = this.homeDBData || {};
    return layout || {};
  }

  set head(payload: IHead) {
    if (this.layout) {
      this.layout.head = payload;
    } else {
      this.layout = {
        head: payload,
      };
    }
  }

  get head() {
    const { head } = this.layout || {};
    return head || {};
  }

  set dataSource(payload: ICard[]) {
    this.homeDBData.dataSource = payload;
  }

  get dataSource() {
    return this.homeDBData.dataSource || [];
  }

  save = () => {
    this.writeDBFileSync(this.homeDBData);
  };

  private readDBFileSync = (dbPath: string) => {
    const data = readFileSync(dbPath, { encoding: 'utf-8' });
    const parseData = JSON.parse(data || '{}');
    this.homeDBData = parseData;
  };

  private readDBFile = (dbPath: string) => {
    return new Promise((resolve, reject) => {
      readFile(dbPath, { encoding: 'utf-8' }, (err, data) => {
        console.log(err, data);
        if (err) {
          reject(err);
        } else {
          const parseData = JSON.parse(data || '{}');
          this.homeDBData = parseData;
          resolve(parseData);
        }
      });
    });
  };

  writeDBFileSync = (payload: Partial<IHomeData>) => {
    try {
      writeFileSync(
        path.join(
          this.sourcePath,
          this.currentDBFile.basePath,
          this.currentDBFile.filename
        ),
        JSON.stringify(payload, null, 2)
      );
    } catch (err) {
      console.warn('[writeDBFileSync]', err);
      return err;
    }
  };

  createFile = (path: string) => {
    return new Promise((resolve, reject) =>
      writeFile(path, JSON.stringify({}), (err) => {
        console.log('[createFile]', err);
        if (err) {
          reject(err);
        }
        resolve({ succcess: true });
      })
    );
  };

  upsertCard = async (card: ICard) => {
    const homeDBData = this.homeDBData || {};
    const { dataSource = [] } = homeDBData || {};
    try {
      const cardDTOIndex = dataSource.findIndex((it) => it.id === card.id);

      if (card.id && cardDTOIndex >= 0) {
        const dto = dataSource[cardDTOIndex];
        dto.title = card.title ?? dto.title;
        dto.cover = card.cover ?? dto.cover;
        dto.wanLink = card.wanLink ?? dto.wanLink;
        dto.lanLink = card.lanLink ?? dto.lanLink;
        dto.autoSelectLink = card.autoSelectLink ?? dto.autoSelectLink;
        dto.openInNewWindow = card.openInNewWindow ?? dto.autoSelectLink;
        dto.coverColor = card.coverColor ?? dto.coverColor;
        this.dataSource = dataSource;
        this.save();

        return dto;
      } else {
        const dto = { ...card, id: `${dataSource.length}` };
        dataSource.push(dto);
        this.dataSource = dataSource;
        this.save();

        return dto;
      }
    } catch (err) {
      return err;
    }
  };

  deleteCard = (id: ICard['id']) => {
    this.dataSource = this.dataSource.filter((card) => card.id !== id);
  };

  updateHead = (head: IHead) => {
    const headDTO = this.head;

    this.head = {
      ...headDTO,
      logo: head.logo ?? headDTO.logo,
      name: head.name ?? headDTO.name,
      logoColor: head.logoColor ?? headDTO.logoColor,
      backgroundImage: head.backgroundImage ?? headDTO.backgroundImage,
    };

    return this.head;
  };

  updateCardListStyle = (payload: ICardListStyle) => {
    const layout = this.layout;
    const cardListStyleDTO = layout.cardListStyle || {};

    cardListStyleDTO.justifyContent =
      payload.justifyContent ?? cardListStyleDTO.justifyContent;
    cardListStyleDTO.alignItems =
      payload.alignItems ?? cardListStyleDTO.alignItems;
    cardListStyleDTO.alignContent =
      payload.alignContent ?? cardListStyleDTO.alignContent;

    layout.cardListStyle = cardListStyleDTO;
    this.layout = layout;

    return layout;
  };

  queryDBFiles = (p: string, basePath = 'db'): Promise<IFile[]> => {
    return new Promise((resolve, reject) => {
      access(p, (err) => {
        if (err) {
          return mkdir(this.customDBDir, (err) => {
            if (err) {
              reject(err);
            } else {
              this.customDBFiles = [];
              resolve([]);
            }
          });
        } else {
          readdir(p, (err, files) => {
            if (err) {
              reject(err);
            } else {
              const dbFiles: IFile[] = files
                .filter((file) => path.extname(file).toLowerCase() === '.json')
                .map((file) => ({
                  filename: file,
                  type: 'custom',
                  basePath,
                }));
              this.customDBFiles = dbFiles;
              resolve(dbFiles);
            }
          });
        }
      });
    });
  };

  selectCustomDBFile = async (
    filename: string,
    basePath = '',
    type: IFile['type']
  ) => {
    if (type === 'default') {
      await this.readDBFile(this.defaultDBPath);
    } else if (
      type === 'custom' &&
      this.customDBFiles.find((file) => file.filename === filename)
    ) {
      await this.readDBFile(path.join(this.customDBDir, filename));
    }
    this.currentDBFile = {
      filename: filename,
      basePath,
      type,
    };
  };

  upsertDBFile = (filename: string) => {
    console.log('[upsertDBFile]', filename);
    return this.createFile(path.join(this.customDBDir, filename));
  };

  deleteDBFile = (filename: string) => {
    return new Promise((resolve, reject) => {
      unlink(path.join(this.customDBDir, filename), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true });
        }
      });
    });
  };
}

export default new HomeService();
