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
  backgroundBlur?: number;
  categoryNameStyle?: string;
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
  // dataSource: ICard[];
  layout: ILayout;
  categories: ICategory[];
}

export interface IDBData {
  [key: string]: IHomeData;
}

export interface IStyle {
  color?: string;
}

export interface ICategory {
  id: string;
  title?: string;
  style?: IStyle;
  key?: keyof IDBData; // configKey
  cards?: ICard[];
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
      if (k.startsWith('HH_') || k.startsWith('NEXT_PUBLIC')) {
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
    const parseData: IDBData = JSON.parse(data || '{}');
    // 数据检查
    Object.entries(parseData).forEach(([k, v]) => {
      const defaultCagegory: ICategory = {
        title: '默认分类',
        key: k,
        id: genUUID(),
        cards: [],
        style: {
          color: '#000',
        },
      };
      if (
        (v.categories instanceof Array && v.categories.length === 0) ||
        !v.categories
      ) {
        // 添加默认分类
        v.categories = [defaultCagegory];
      }

      if (!v.layout) {
        v.layout = {
          head: {},
        };
      }
    });

    this._dbData = parseData;
    // const saveResult = this.writeDBFile(this._defaultDBPath, parseData);
    // if (saveResult.success !== true) {
    //   console.log('init error', saveResult);
    //   throw saveResult;
    // }
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

  public updateCards(targetKey: string, categoryId: string, payload: ICard[]) {
    const targetData = this._dbData[targetKey] || {};
    const category = targetData.categories.find((it) => it.id === categoryId);
    if (category) {
      category.cards = payload;
    }
    const dbData = targetData;
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

  public getCards(key: string, categoryId: string) {
    const targetData = this._dbData[key] || {};
    return (
      targetData.categories.find((it) => it.id === categoryId)?.cards || []
    );
  }
  public getCategoryFromCardId(cardId: string, key: string) {
    // TODO
    if (key) {
      const targetData = this._dbData[key] || {};
      const categories = targetData.categories;
      let category: ICategory | undefined;
      let cards: ICard[] = [];
      categories.some((it) => {
        cards = it.cards || [];
        const card = cards?.find((v) => v.id === cardId);
        if (card) {
          category = it;
          return true;
        }
        return false;
      });
      return category;
    }
    return undefined;
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

  public getCategoryCards(key: string, categoryId: string) {
    const dbData = this._dbData[key] || {};
    return dbData.categories.find((it) => it.id === categoryId)?.cards || [];
  }
}

export default HomeService.getInstance();
