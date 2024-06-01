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

/**
 * 单例使用
 */
class HomeService {
  private homeDBPath = path.join(process.cwd(), 'home.json');
  homeDBData: Partial<IHomeData> = {};

  constructor() {
    this.readDBFileSync();
  }

  get getHomeDBData() {
    return this.homeDBData;
  }

  set layout(payload: ILayout) {
    this.homeDBData.layout = payload;
  }

  get layout() {
    const { layout } = this.homeDBData || {};
    return layout || {};
  }

  set head(payload: IHead) {
    this.homeDBData.layout = {
      ...(this.layout || {}),
      head: payload,
    };
  }

  get head() {
    const { head } = this.homeDBData.layout || {};
    return head || {};
  }

  set dataSource(payload: ICard[]) {
    this.homeDBData.dataSource = payload;
  }

  get dataSource() {
    const { dataSource = [] } = this.homeDBData;
    return dataSource;
  }

  save = () => {
    this.writeDBFileSync(this.homeDBData);
  };

  private readDBFileSync = () => {
    const data = readFileSync(this.homeDBPath, { encoding: 'utf-8' });
    const parseData = JSON.parse(data || '{}');
    this.homeDBData = parseData;
  };

  writeDBFileSync = (payload: Partial<IHomeData>) => {
    try {
      writeFileSync(this.homeDBPath, JSON.stringify(payload, null, 2));
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
  }

  deleteCard(id: ICard['id']) {
    this.dataSource = this.dataSource.filter((card) => card.id !== id);
  }

  updateHead(head: IHead) {
    const headDTO = this.head;

    this.head = {
      ...headDTO,
      logo: head.logo ?? headDTO.logo,
      name: head.name ?? headDTO.name,
      logoColor: head.logoColor ?? headDTO.logoColor,
      backgroundImage: head.backgroundImage ?? headDTO.backgroundImage,
    };

    return this.head;
  }

  updateCardListStyle(payload: ICardListStyle) {
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
  }
}

export default new HomeService();
