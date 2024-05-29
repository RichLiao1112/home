'use client';

import { ICard } from '@/services/home';
import styles from './index.module.css';
import { useContext } from 'react';
import { PageContext } from '@/context/page.context';
import classNames from 'classnames';
import { MinusCircleFilled } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { apiDeleteCard } from '@/requests';
import { useRouter } from 'next/navigation';
import Iconify from '../Iconify';
import { isHttpSource } from '@/common';

export interface IProps {
  payload: ICard;
}

const Card = (props: IProps) => {
  const router = useRouter();
  const { payload } = props;
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

  const onClickDelete = (payload: ICard) => {
    Modal.confirm({
      title: `确定删除 ${payload.title} ？`,
      onOk: () => apiDeleteCard(payload.id).finally(() => router.refresh()),
    });
  };

  const renderCover = (source?: string, coverColor?: string) => {
    if (isHttpSource(source)) {
      return <img src={source} alt='' className={styles.cover} />;
    }
    if (source) {
      return (
        <div className={styles.cover} style={{ color: coverColor }}>
          <Iconify icon={source} width='100%' height='100%' />
        </div>
      );
    }
    return <div className={styles.cover}>{payload.title[0]}</div>;
  };

  return (
    <div className={styles.cardWrapper}>
      {editCardMode === true && (
        <div className={styles.delete}>
          <Button
            type='text'
            icon={
              <MinusCircleFilled style={{ color: 'red', fontSize: '1rem' }} />
            }
            onClick={() => onClickDelete(payload)}
          />
        </div>
      )}
      <div
        className={classNames(
          styles.card,
          editCardMode === true ? styles.shake : ''
        )}
        onClick={onCardClick}
      >
        <div className={styles.mask}></div>
        {renderCover(payload.cover, payload.coverColor)}
        <div className={styles.title}>
          <span>{payload.title}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
