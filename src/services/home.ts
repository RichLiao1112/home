import { defaultDBFile } from '@/common';
import { readFileSync, writeFileSync } from 'fs';
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

export interface IDBData {
  [key: string]: IHomeData;
}

/**
 * 单例使用
 */
class HomeService {
  private static instance: HomeService;
  private readonly sourcePath = process.cwd();
  private _defaultDBPath = path.join(this.sourcePath, defaultDBFile.filename);

  private _dbData: IDBData = {};

  private _selectedKey: string = '';

  private constructor() {
    this.readDBFileSync(this._defaultDBPath);
    this.setSelectedKey('default');
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

  private readDBFileSync = async (dbPath: string) => {
    const data = readFileSync(dbPath, { encoding: 'utf-8' });
    const parseData = JSON.parse(data || '{}');
    let result: IDBData = parseData;
    if (parseData && !parseData.default) {
      // 兼容历史版本的配置数据
      result = {
        default: {
          ...parseData,
        },
      };
    }

    // 数据检查
    Object.entries(result).forEach(([k, v]) => {
      if (v.dataSource && v.dataSource instanceof Array) {
        v.dataSource.map((card, index) => {
          card.id = `${index}`;
          return card;
        });
      } else {
        v.dataSource = [];
      }

      if (!v.layout) {
        v.layout = {
          cardListStyle: {
            justifyContent: 'center',
            alignContent: 'flex-start',
            alignItems: 'center',
          },
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

  public getSelectedKey() {
    return this._selectedKey;
  }

  public setSelectedKey(targetKey: string) {
    this._selectedKey = targetKey;
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

  public getLayout() {
    const targetData = this._dbData[this._selectedKey] || {};
    return targetData.layout;
  }

  public getHead() {
    const targetData = this._dbData[this._selectedKey] || {};
    return targetData.layout?.head;
  }

  public getCards() {
    const targetData = this._dbData[this._selectedKey] || {};
    return targetData.dataSource;
  }

  public queryConfigKeys() {
    return Object.keys(this._dbData);
  }
}

export default HomeService.getInstance();
