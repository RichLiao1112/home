import { readFile, readFileSync, writeFileSync } from 'fs';
import path from 'path';

export interface ICard {
  title: string;
  cover?: string;
  wanLink?: string;
  lanLink?: string;
  autoSelectLink?: boolean;
  openInNewWindow?: boolean;
  id?: string;
}

export interface IHead {
  logo?: string;
  name?: string;
}

export interface IHomeData {
  head: IHead;
  dataSource: ICard[];
}

/**
 * 单例使用
 */
class HomeService {
  homeDBPath = path.join(process.cwd(), 'db', 'home.json');
  homeDBData: Partial<IHomeData> = {};

  constructor() {
    this.readDBFileSync();
  }

  private readDBFileSync = () => {
    const data = readFileSync(this.homeDBPath, { encoding: 'utf-8' });
    const parseData = JSON.parse(data || '{}');
    this.homeDBData = parseData;
  };

  // readDBFile = (): Promise<{
  //   data: IHomeData | undefined;
  //   message: any;
  // }> => {
  //   return new Promise((resolve) => {
  //     readFile(this.homeDBPath, { encoding: 'utf-8' }, (err, res) => {
  //       if (err) {
  //         return resolve({ message: err, data: undefined });
  //       }
  //       try {
  //         const result = JSON.parse(res);
  //         const { dataSource = [] } = result;
  //         dataSource.forEach((item: ICard, index: number) => {
  //           item.id = index;
  //         });
  //         this.homeDBData = result;
  //         return resolve({ data: result, message: 'success' });
  //       } catch (err) {
  //         return resolve({ data: undefined, message: err });
  //       }
  //     });
  //   });
  // };

  writeDBFileSync = (payload: Partial<IHomeData>) => {
    try {
      writeFileSync(this.homeDBPath, JSON.stringify(payload, null, 2));
      this.readDBFileSync();
    } catch (err) {
      console.warn('[writeDBFileSync]', err);
      return err;
    }
  };

  async upsertCard(card: ICard) {
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
        this.writeDBFileSync(homeDBData);
        return dto;
      } else {
        const dto = { ...card, id: `${dataSource.length}` };
        dataSource.push(dto);
        this.writeDBFileSync(homeDBData);
        return dto;
      }
    } catch (err) {
      return err;
    }
  }

  updateHead(head: IHead) {
    const homeDBData = this.homeDBData || {};
    const headDTO = homeDBData.head || {};
    headDTO.logo = head.logo ?? headDTO.logo;
    headDTO.name = head.name ?? headDTO.name;
    this.writeDBFileSync(homeDBData);
    return headDTO;
  }
}

export default new HomeService();
