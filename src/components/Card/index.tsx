'use client';

import { ICard } from '@/services/home';
import styles from './index.module.css';
import { Suspense, useContext, useEffect, useMemo, useState } from 'react';
import { PageContext } from '@/context/page.context';
import classNames from 'classnames';
import {
  MinusCircleFilled,
  GlobalOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { Badge, Button, Modal, Tooltip } from 'antd';
import { apiDeleteCard } from '@/requests';
import { useRouter } from 'next/navigation';
import Iconify from '../Iconify';
import { isHttpSource, jumpMode } from '@/common';

export type TType = 'normal' | 'add';

export interface IProps {
  payload: ICard;
  type?: TType;
}

const Card = (props: IProps) => {
  const router = useRouter();
  const { payload, type } = props;
  const { editCardMode, setEditModalData, linkMode } = useContext(PageContext);

  const [showWanBadge, setShowWanBadge] = useState(false);

  useEffect(() => {
    return setShowWanBadge(
      !!(type !== 'add' && linkMode === jumpMode.wan && payload.wanLink)
    );
  }, [type, payload.wanLink, linkMode]);

  const onCardClick = () => {
    if (type === 'add') {
      setEditModalData?.({
        open: true,
        title: '',
        data: {
          title: '',
          cover: '',
          wanLink: '',
          lanLink: '',
        },
      });
    } else if (editCardMode === true) {
      setEditModalData?.({
        open: true,
        title: `修改 ${payload.title || ''}`,
        data: payload,
      });
    } else {
      let url = payload.wanLink || payload.lanLink;
      let openInNewWindow = payload.openInNewWindow !== false;
      if (linkMode === jumpMode.lan && payload.lanLink) {
        url = payload.lanLink;
      }

      if (url?.startsWith('http://') || url?.startsWith('https://')) {
      } else if (url) {
        url = 'http://' + url;
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

  const renderDelete = () => {
    if (type === 'add') {
      return null;
    }
    if (editCardMode === true) {
      return (
        <div className={styles.delete}>
          <Button
            type='text'
            icon={
              <MinusCircleFilled style={{ color: 'red', fontSize: '1rem' }} />
            }
            onClick={() => onClickDelete(payload)}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.cardWrapper}>
      {renderDelete()}
      <div
        className={classNames(
          styles.card,
          editCardMode === true && type !== 'add' ? styles.shake : ''
        )}
        onClick={onCardClick}
      >
        {showWanBadge && (
          <Tooltip title='优先跳转公网地址'>
            <div className={styles['status-lan']}>
              <Badge status='processing' text='' />
            </div>
          </Tooltip>
        )}
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
