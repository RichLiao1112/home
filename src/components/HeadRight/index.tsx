'use client';

import {
  EditOutlined,
  SettingOutlined,
  CheckOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import styles from './index.module.css';
import { Button, Tooltip, Modal, Form, Drawer, Space } from 'antd';
import { useContext, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { PageContext } from '@/context/page.context';
import EditForm from '../EditForm';
import { ICard, IHead } from '@/services/home';
import { apiUpdateHead, apiUpsertCard } from '@/requests';
import SettingForm from '../SettingForm';

export interface IProps {
  payload: IHead;
}

const HeadRight = (props: IProps) => {
  const { payload } = props;
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
  const [settingForm] = Form.useForm<IHead>();
  const [fetching, setFetching] = useState(false);
  const [isPending, startTransition] = useTransition();

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
    setEditDrawerData?.({ open: true, title: '', data: payload });
  };

  const onSubmitSettingForm = async () => {
    try {
      setFetching(true);
      const data = await settingForm.validateFields();
      const res = await apiUpdateHead(data);
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
        okText='保存'
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
            type='primary'
            onClick={onSubmitSettingForm}
            loading={fetching}
            disabled={fetching}
          >
            保存
          </Button>
        }
      >
        <SettingForm form={settingForm} originData={payload} />
      </Drawer>

      <div>
        <Tooltip title='新增'>
          <Button
            icon={<AppstoreAddOutlined style={{ fontSize: '1rem' }} />}
            type='text'
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
      </div>
      <div className={styles.edit}>
        {editCardMode === false ? (
          <Tooltip title='编辑'>
            <Button
              icon={<EditOutlined style={{ fontSize: '1rem' }} />}
              type='text'
              onClick={() => setEditCardMode?.(true)}
            />
          </Tooltip>
        ) : (
          <Tooltip title='结束'>
            <Button
              icon={<CheckOutlined style={{ fontSize: '1rem' }} />}
              type='text'
              onClick={() => setEditCardMode?.(false)}
            />
          </Tooltip>
        )}
      </div>
      <div className={styles.settings}>
        <Tooltip title='设置'>
          <Button
            icon={<SettingOutlined />}
            type='text'
            onClick={onShowDrawer}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default HeadRight;
