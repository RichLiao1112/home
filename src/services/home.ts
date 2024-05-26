import { readFile } from 'fs';
import path from 'path';

export interface ICard {
  title: string;
  cover?: string;
  wanLink?: string;
  lanLink?: string;
  autoSelectLink?: boolean;
  openInNewWindow?: boolean;
}

export interface IHead {
  logo?: string;
  name?: string;
}

export interface IHomeData {
  head: IHead;
  dataSource: ICard[];
}

export class HomeService {
  homeDBPath = path.join(process.cwd(), 'db', 'home.json');

  readDBFile = (): Promise<{
    data: IHomeData | undefined;
    message: any;
  }> => {
    return new Promise((resolve) => {
      readFile(this.homeDBPath, { encoding: 'utf-8' }, (err, res) => {
        if (err) {
          return resolve({ message: err, data: undefined });
        }
        try {
          const result = JSON.parse(res);
          return resolve({ data: result, message: 'success' });
        } catch (err) {
          return resolve({ data: undefined, message: err });
        }
      });
    });
  };
}
