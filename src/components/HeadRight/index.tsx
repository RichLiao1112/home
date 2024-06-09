'use client';

import styles from './index.module.css';
import { Button, Tooltip, Modal, Form, Drawer, message, Space } from 'antd';
import { useContext, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { PageContext } from '@/context/page.context';
import EditForm from '../EditForm';
import { ICard, ILayout } from '@/services/home';
import { apiQueryDBFiles, apiUpdateUI, apiUpsertCard } from '@/requests';
import SettingForm from '../SettingForm';
import { getLinkJumpMode, jumpMode, setLinkJumpMode } from '@/common';
import { NetIconLan, NetIconWan } from '../NetIcon';
import DBSelect, { TFileOptions } from '../DBSelect';
import Iconify from '../Iconify';

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

  // 配置表
  const [options, setOptions] = useState<TFileOptions>([]);
  const [current, setCurrent] = useState<string>();

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

  const fetchDBFiles = () => {
    return apiQueryDBFiles().then((res) => {
      const { data } = res;
      const { all, current } = data;
      const dbConfigs = all.map((it: string) => ({ label: it, value: it }));
      setCurrent(current);
      setOptions(dbConfigs);
      return dbConfigs;
    });
  };

  const onDBSelectChange = () => {
    return fetchDBFiles().then(() => router.refresh());
  };

  useEffect(() => {
    const mode = getLinkJumpMode();
    setLinkMode?.(mode || jumpMode.wan);
  }, [setLinkMode]);

  useEffect(() => {
    fetchDBFiles();
  }, []);

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
        destroyOnClose
      >
        <>
          <div className={styles.title}>外观</div>
          <SettingForm form={settingForm} originData={layout} />
          <div className={styles.btns}>
            <Button
              type='primary'
              onClick={onSubmitSettingForm}
              loading={fetching}
              disabled={fetching}
              size='small'
            >
              保存
            </Button>
          </div>
          <div className={styles.blank}></div>
          <div className={styles.title}>
            配置<span className={styles.tips}>设置多份配置，切换使用</span>
          </div>
          <DBSelect
            onChange={onDBSelectChange}
            value={current}
            options={options}
          />
        </>
      </Drawer>

      <Space>
        {options.length > 1 && (
          <DBSelect
            hideDelete
            hideButtions
            selectStyle={{ width: '6rem', fontSize: '.6rem' }}
            onChange={onDBSelectChange}
            value={current}
            options={options}
          />
        )}
        {linkMode === jumpMode.wan ? (
          <NetIconWan handleClick={() => modifyLinkJumpMode(jumpMode.lan)} />
        ) : (
          <NetIconLan handleClick={() => modifyLinkJumpMode(jumpMode.wan)} />
        )}
        {editCardMode === false ? (
          <Tooltip title='编辑'>
            <Button
              icon={<Iconify icon='uil:edit-alt' width='1rem' height='1rem' />}
              type='default'
              onClick={() => setEditCardMode?.(true)}
            />
          </Tooltip>
        ) : (
          <Tooltip title='结束'>
            <Button
              icon={<Iconify icon='ep:finished' width='1rem' height='1rem' />}
              type='default'
              onClick={() => setEditCardMode?.(false)}
            />
          </Tooltip>
        )}
        <Tooltip title='设置'>
          <Button
            icon={
              <Iconify icon='iconamoon:settings' width='1rem' height='1rem' />
            }
            type='default'
            onClick={onShowDrawer}
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default HeadRight;
