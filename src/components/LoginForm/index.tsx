'use client';

import { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import styles from './index.module.css';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onFinish = async (values: { password: string }) => {
    setLoading(true);
    const success = await login(values.password);
    setLoading(false);

    if (success) {
      message.success('登录成功');
      // 刷新页面以更新状态
      window.location.reload();
    } else {
      message.error('密码错误');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.title}>管理登录</div>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入登录密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入登录密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
