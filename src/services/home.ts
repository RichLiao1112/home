import { defaultDBFile, genUUID } from '@/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

export interface ICard {
  title: string;
  cover?: string;
  wanLink?: string;
  lanLink?: string;
  autoSelectLink?: boolean;
  openInNewWindow?: boolean;
  id: string;
  coverColor?: string;
  categoryId?: ICategory['id'];
  key?: keyof IDBData; // configKey
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
  categories: ICategory[];
}

export interface IDBData {
  [key: string]: IHomeData;
}

export interface ICategory {
  id?: string;
  title?: string;
  style?: string;
  key?: keyof IDBData; // configKey
}

/**
 * 单例使用
 */
class HomeService {
  private static instance: HomeService;
  private readonly sourcePath = process.cwd();
  private _defaultDBPath = path.join(this.sourcePath, defaultDBFile.filename);

  private _dbData: IDBData = {};

  private _hhenv: IEnv = {};

  private constructor() {
    this.readDBFileSync(this._defaultDBPath);
    this.initEnvData();
  }

  public static getInstance(): HomeService {
    if (!HomeService.instance) {
      HomeService.instance = new HomeService();
    }
    return HomeService.instance;
  }

  public getDefaultDBPath() {
    return this._defaultDBPath;
  }

  private initEnvData = () => {
    const selfSetENV: Record<string, any> = {};
    Object.entries(process.env).forEach(([k, v]) => {
      if (k.startsWith('HH_')) {
        selfSetENV[k] = v;
      }
    });
    this._hhenv = selfSetENV;
  };

  private readDBFileSync = async (dbPath: string) => {
    if (!existsSync(dbPath)) {
      writeFileSync(dbPath, JSON.stringify({}), 'utf-8');
    }
    const data = readFileSync(dbPath, { encoding: 'utf-8' });
    const parseData = JSON.parse(data || '{}');
    let result: IDBData = parseData;
    if (parseData) {
      // 兼容历史版本的配置数据
      if (!parseData.default) {
        // 设置默认配置"default"
        result = {
          default: {
            ...parseData,
          },
        };
      }
    }

    // 数据检查
    Object.entries(result).forEach(([k, v]) => {
      if (
        (v.categories instanceof Array && v.categories.length === 0) ||
        !v.categories
      ) {
        v.categories = [
          {
            title: '默认分类',
            key: k,
            id: genUUID(),
          },
        ];
      }
      if (v.dataSource && v.dataSource instanceof Array) {
        v.dataSource.forEach((card) => {
          card.id = card.id?.includes('-') ? card.id : genUUID();
          if (
            v.categories.find((category) => category.id === card.categoryId)
          ) {
          } else {
            card.categoryId = v.categories?.[0]?.id;
          }
        });
      } else {
        v.dataSource = [];
      }

      if (!v.layout) {
        v.layout = {
          head: {},
        };
      }
    });
    this._dbData = result;

    const saveResult = this.writeDBFile(this._defaultDBPath, this._dbData);
    if (saveResult.success !== true) {
      throw Error(saveResult.message);
    }
  };

  public getDBData() {
    return this._dbData;
  }

  public updateDBData(targetKey: string, payload: IHomeData | null) {
    if (payload === null) {
      this._dbData = Object.fromEntries(
        Object.entries(this._dbData).filter(([k, v]) => k !== targetKey)
      );
    } else {
      this._dbData = {
        ...this._dbData,
        [targetKey]: payload,
      };
    }
  }

  public writeDBFile(path: string, payload: IDBData) {
    try {
      writeFileSync(path, JSON.stringify(payload, null, 2), 'utf-8');
      return { success: true, message: '' };
    } catch (err: any) {
      console.log('[writeFileSync error]', err);
      return { success: false, message: err?.message };
    }
  }

  public updateLayout(targetKey: string, payload: ILayout) {
    const targetData = this._dbData[targetKey] || {};
    const dbData = {
      ...targetData,
      layout: payload,
    };
    this.updateDBData(targetKey, dbData);
  }

  public updateCards(targetKey: string, payload: ICard[]) {
    const targetData = this._dbData[targetKey] || {};
    const dbData = {
      ...targetData,
      dataSource: payload,
    };
    this.updateDBData(targetKey, dbData);
  }

  public updateCategories(targetKey: string, payload: ICategory[]) {
    const targetData = this._dbData[targetKey] || {};
    const dbData = {
      ...targetData,
      categories: payload,
    };
    this.updateDBData(targetKey, dbData);
  }

  public getLayout(key: string) {
    const targetData = this._dbData[key] || {};
    return targetData.layout;
  }

  public getHead(key: string) {
    const targetData = this._dbData[key] || {};
    return targetData.layout?.head;
  }

  public getCards(key: string) {
    const targetData = this._dbData[key] || {};
    return targetData.dataSource;
  }

  public getCategories(key: string) {
    const targetData = this._dbData[key] || {};
    return targetData.categories;
  }

  public queryConfigKeys() {
    return Object.keys(this._dbData);
  }

  public getHHEnv() {
    return this._hhenv;
  }
}

export default HomeService.getInstance();
