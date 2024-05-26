'use client';

import {
  EditOutlined,
  SettingOutlined,
  CheckOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import styles from './index.module.css';
import { Button, Tooltip, Modal, Form } from 'antd';
import { useContext } from 'react';
import { PageContext } from '@/context/page.context';
import EditForm from '../EditForm';
import { ICard } from '@/services/home';

const HeadRight = () => {
  const { editCardMode, setEditCardMode, editModalData, setEditModalData } =
    useContext(PageContext);
  const [form] = Form.useForm<ICard>();

  const onCancelModal = () => {
    setEditModalData?.(undefined);
  };

  const onSubmitForm = async () => {
    try {
      const data = await form.validateFields();
      console.log(data);
    } catch (err) {
      console.log('[err]', err);
    }
  };

  return (
    <div className={styles.right}>
      <Modal
        open={editModalData?.open}
        title={editModalData?.title}
        onCancel={onCancelModal}
        onOk={onSubmitForm}
        destroyOnClose
      >
        <EditForm form={form} originData={editModalData?.data} />
      </Modal>
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
          <Tooltip title='保存'>
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
          <Button icon={<SettingOutlined />} type='text' />
        </Tooltip>
      </div>
    </div>
  );
};

export default HeadRight;
