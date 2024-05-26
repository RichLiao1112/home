'use client';

import { ICard } from '@/services/home';
import styles from './index.module.css';
import { useContext } from 'react';
import { PageContext } from '@/context/page.context';
import classNames from 'classnames';

export interface IProps {
  payload: ICard;
  index: number;
}

const Card = (props: IProps) => {
  const { payload, index } = props;
  const { editCardMode, setEditModalData } = useContext(PageContext);

  const onCardClick = () => {
    if (editCardMode === true) {
      setEditModalData?.({
        open: true,
        title: `修改 ${payload.title || ''}`,
        data: payload,
      });
    } else {
      let url = payload.wanLink || payload.lanLink;
      let openInNewWindow = payload.openInNewWindow !== false;
      if (payload.autoSelectLink !== false && payload.lanLink) {
        if (
          location.host.startsWith('localhost') ||
          /[a-zA-Z]/g.test(location.host) !== true
        ) {
          url = payload.lanLink;
        }
      }
      window.open(url, openInNewWindow ? '_blank' : '_self');
    }
  };

  return (
    <div
      className={classNames(
        styles.card,
        editCardMode === true ? styles.shake : ''
      )}
      onClick={onCardClick}
    >
      <div className={styles.mask}></div>
      <img src={payload.cover} alt='' className={styles.cover} />
      <div className={styles.title}>
        <span>{payload.title}</span>
      </div>
    </div>
  );
};

export default Card;
