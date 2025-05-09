'use client';

import { ICard } from '@/services/home';
import styles from './index.module.css';
import { useContext } from 'react';
import { PageContext } from '@/context/page.context';
import classNames from 'classnames';
import { Badge, Button, Modal, Tooltip, message } from 'antd';
import { apiDeleteCard } from '@/requests';
import { useRouter } from 'next/navigation';
import Iconify from '../Iconify';
import {
  ensureProtocol,
  getLinkJumpMode,
  isHttpSource,
  jumpMode,
} from '@/common';

export type TType = 'normal' | 'add' | 'addCategory';

export interface IProps {
  payload: Partial<ICard>;
  type?: TType;
  configKey?: string;
  addCardNormalCategoryId?: string;
}

const Card = (props: IProps) => {
  const router = useRouter();
  const {
    payload,
    type = 'normal',
    configKey,
    addCardNormalCategoryId,
  } = props;
  const { editCardMode, setEditModalData, linkMode, setEditCategory } =
    useContext(PageContext);

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
          categoryId: addCardNormalCategoryId,
        },
      });
    } else if (type === 'addCategory') {
      setEditCategory?.({
        open: true,
        title: '新增分类',
        data: {
          title: '',
          style: {
            color: '#000',
          },
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

      if (url) {
        url = ensureProtocol(url);
      }

      try {
        let newWindow = window.open(url, openInNewWindow ? '_blank' : '_self');
        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed === 'undefined'
        ) {
          throw new Error('Failed to open the URL.');
        }
      } catch (e: any) {
        message.error(e.message);
      }
    }
  };

  const onClickDelete = (payload: Partial<ICard>) => {
    if (!payload.id) {
      return message.warning('数据错误，缺少ID');
    }
    Modal.confirm({
      title: `确定删除 ${payload.title} ？`,
      onOk: () =>
        apiDeleteCard({ id: payload.id ?? '', key: configKey }).finally(() =>
          router.refresh()
        ),
    });
  };

  const renderCover = (source?: string, coverColor?: string) => {
    if (isHttpSource(source)) {
      return (
        <div className={styles.cover}>
          <img src={source} alt='' />
        </div>
      );
    }
    if (source) {
      return (
        <div className={styles.cover} style={{ color: coverColor }}>
          <Iconify icon={source} width='100%' height='100%' />
        </div>
      );
    }
    return (
      <div className={styles.cover}>
        <span>{payload.title?.[0]}</span>
      </div>
    );
  };

  const renderDelete = () => {
    if (type !== 'normal') {
      return null;
    }
    if (editCardMode === true) {
      return (
        <div className={styles.delete}>
          <Button
            type='text'
            icon={
              <span style={{ color: 'red' }}>
                <Iconify
                  icon='mdi:minus-circle'
                  width='1.2rem'
                  height='1.2rem'
                />
              </span>
            }
            onClick={() => onClickDelete(payload)}
          />
        </div>
      );
    }
    return null;
  };

  const renderWanBadge = () => {
    if (type === 'add') return null;
    if (payload.wanLink) {
      if (linkMode === jumpMode.wan || !payload.lanLink) {
        return (
          <Tooltip title='跳转公网地址'>
            <div className={styles['status-lan']}>
              <Badge status='processing' text='' />
            </div>
          </Tooltip>
        );
      }
    }
    return null;
  };

  return (
    <div className={styles.cardWrapper}>
      {renderDelete()}
      <div
        className={classNames(
          styles.card,
          editCardMode === true && type === 'normal' ? styles.shake : ''
        )}
        onClick={onCardClick}
      >
        {renderWanBadge()}
        {renderCover(payload.cover, payload.coverColor)}
        <div className={styles.title}>
          <span>{payload.title}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
