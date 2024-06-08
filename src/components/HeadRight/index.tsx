'use client';

import {
  EditOutlined,
  SettingOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import styles from './index.module.css';
import {
  Button,
  Tooltip,
  Modal,
  Form,
  Drawer,
  Typography,
  message,
  Space,
} from 'antd';
import { useContext, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { PageContext } from '@/context/page.context';
import EditForm from '../EditForm';
import { ICard, ILayout } from '@/services/home';
import { apiUpdateUI, apiUpsertCard } from '@/requests';
import SettingForm from '../SettingForm';
import { getLinkJumpMode, jumpMode, setLinkJumpMode } from '@/common';
import { NetIconLan, NetIconWan } from '../NetIcon';
import DBSelect from '../DBSelect';

const { Title } = Typography;

export interface IProps {
  layout: ILayout;
  configKey: string | undefined;
}

const HeadRight = (props: IProps) => {
  const { layout, configKey } = props;
  const router = useRouter();

  const {
    editCardMode,
    setEditCardMode,
    editModalData,
    setEditModalData,
    editDrawerData,
    setEditDrawerData,
    linkMode,
    setLinkMode,
  } = useContext(PageContext);

  const [form] = Form.useForm<ICard>();
  const [settingForm] = Form.useForm<ILayout>();
  const [fetching, setFetching] = useState(false);
  const [, startTransition] = useTransition();

  const onCancelModal = () => {
    setEditModalData?.(undefined);
  };

  const onSubmitForm = async () => {
    try {
      setFetching(true);
      const data = await form.validateFields();
      const res = await apiUpsertCard({ ...data, key: configKey });
      if (res.success) {
        onCancelModal();
      } else {
        message.error(res.message);
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
        key: configKey,
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
    setLinkMode?.(mode);
  };

  useEffect(() => {
    const mode = getLinkJumpMode();
    setLinkMode?.(mode || jumpMode.wan);
  }, [setLinkMode]);

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
      >
        <>
          <Title level={5}>外观</Title>
          <SettingForm form={settingForm} originData={layout} />
          <div className={styles.btns}>
            <Button
              type="primary"
              onClick={onSubmitSettingForm}
              loading={fetching}
              disabled={fetching}
              size="small"
            >
              保存
            </Button>
          </div>
          <div className={styles.blank}></div>
          <Title level={5}>配置</Title>
          <DBSelect />
        </>
      </Drawer>

      <Space>
        {linkMode === jumpMode.wan ? (
          <NetIconWan handleClick={() => modifyLinkJumpMode(jumpMode.lan)} />
        ) : (
          <NetIconLan handleClick={() => modifyLinkJumpMode(jumpMode.wan)} />
        )}
        {editCardMode === false ? (
          <Tooltip title="编辑">
            <Button
              icon={<EditOutlined style={{ fontSize: '1rem' }} />}
              type="default"
              onClick={() => setEditCardMode?.(true)}
            />
          </Tooltip>
        ) : (
          <Tooltip title="结束">
            <Button
              icon={<CheckOutlined style={{ fontSize: '1rem' }} />}
              type="default"
              onClick={() => setEditCardMode?.(false)}
            />
          </Tooltip>
        )}
        <Tooltip title="设置">
          <Button
            icon={<SettingOutlined />}
            type="default"
            onClick={onShowDrawer}
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default HeadRight;
