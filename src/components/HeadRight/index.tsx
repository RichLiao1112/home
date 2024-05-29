'use client';

import {
  EditOutlined,
  SettingOutlined,
  CheckOutlined,
  AppstoreAddOutlined,
  GlobalOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import styles from './index.module.css';
import { Button, Tooltip, Modal, Form, Drawer } from 'antd';
import { useContext, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { PageContext } from '@/context/page.context';
import EditForm from '../EditForm';
import { ICard, ILayout } from '@/services/home';
import { apiUpdateUI, apiUpsertCard } from '@/requests';
import SettingForm from '../SettingForm';
import { getLinkJumpMode, jumpMode, setLinkJumpMode } from '@/common';

export interface IProps {
  layout: ILayout;
}

const HeadRight = (props: IProps) => {
  const { layout } = props;
  const router = useRouter();

  const {
    editCardMode,
    setEditCardMode,
    editModalData,
    setEditModalData,
    editDrawerData,
    setEditDrawerData,
  } = useContext(PageContext);

  const [form] = Form.useForm<ICard>();
  const [settingForm] = Form.useForm<ILayout>();
  const [fetching, setFetching] = useState(false);
  const [, startTransition] = useTransition();

  const [currentJumpMode, setCurrentJumpMode] = useState(getLinkJumpMode());

  const onCancelModal = () => {
    setEditModalData?.(undefined);
  };

  const onSubmitForm = async () => {
    try {
      setFetching(true);
      const data = await form.validateFields();
      const res = await apiUpsertCard(data);
      if (res.success) {
        onCancelModal();
      }
    } catch (err) {
      console.log('[err]', err);
    } finally {
      setFetching(false);
      startTransition(() => router.refresh());
    }
  };

  const onCancelDrawer = () => {
    setEditDrawerData?.(undefined);
  };

  const onShowDrawer = () => {
    setEditDrawerData?.({ open: true, title: '', data: layout });
  };

  const onSubmitSettingForm = async () => {
    try {
      setFetching(true);
      const data = await settingForm.validateFields();
      const res = await apiUpdateUI({
        ...data,
        cardListStyle: data.cardListStyle
          ? JSON.parse(data.cardListStyle as string)
          : undefined,
      });
      if (res.success) {
        onCancelDrawer();
      }
    } catch (err) {
      console.log('[err]', err);
    } finally {
      setFetching(false);
      startTransition(() => router.refresh());
    }
  };

  const modifyLinkJumpMode = (mode: string) => {
    setLinkJumpMode(mode);
    setCurrentJumpMode(mode);
  };

  return (
    <div className={styles.right}>
      <Modal
        open={editModalData?.open}
        title={editModalData?.title}
        onCancel={onCancelModal}
        onOk={onSubmitForm}
        okButtonProps={{
          loading: fetching,
          disabled: fetching,
        }}
        okText="保存"
        destroyOnClose
      >
        <EditForm form={form} originData={editModalData?.data} />
      </Modal>

      <Drawer
        open={editDrawerData?.open}
        title={editDrawerData?.title}
        onClose={onCancelDrawer}
        extra={
          <Button
            type="primary"
            onClick={onSubmitSettingForm}
            loading={fetching}
            disabled={fetching}
          >
            保存
          </Button>
        }
      >
        <SettingForm form={settingForm} originData={layout} />
      </Drawer>

      {currentJumpMode === jumpMode.lan ? (
        <Tooltip title="优先跳转内网地址">
          <Button
            icon={<GlobalOutlined style={{ fontSize: '1rem' }} />}
            type="text"
            onClick={() => modifyLinkJumpMode(jumpMode.wan)}
          />
        </Tooltip>
      ) : (
        <Tooltip title="优先跳转公网地址">
          <Button
            icon={<DesktopOutlined style={{ fontSize: '1rem' }} />}
            type="text"
            onClick={() => modifyLinkJumpMode(jumpMode.lan)}
          />
        </Tooltip>
      )}
      <Tooltip title="新增">
        <Button
          icon={<AppstoreAddOutlined style={{ fontSize: '1rem' }} />}
          type="text"
          onClick={() =>
            setEditModalData?.({
              open: true,
              title: '',
              data: {
                title: '',
                cover: '',
                wanLink: '',
                lanLink: '',
              },
            })
          }
        />
      </Tooltip>
      {editCardMode === false ? (
        <Tooltip title="编辑">
          <Button
            icon={<EditOutlined style={{ fontSize: '1rem' }} />}
            type="text"
            onClick={() => setEditCardMode?.(true)}
          />
        </Tooltip>
      ) : (
        <Tooltip title="结束">
          <Button
            icon={<CheckOutlined style={{ fontSize: '1rem' }} />}
            type="text"
            onClick={() => setEditCardMode?.(false)}
          />
        </Tooltip>
      )}
      <Tooltip title="设置">
        <Button icon={<SettingOutlined />} type="text" onClick={onShowDrawer} />
      </Tooltip>
    </div>
  );
};

export default HeadRight;
