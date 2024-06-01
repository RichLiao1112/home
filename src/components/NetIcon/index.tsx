import { DesktopOutlined, GlobalOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

export interface IProps {
  handleClick: () => void;
}

export const NetIconWan = (props: IProps) => {
  return (
    <Tooltip title='优先跳转公网地址'>
      <Button
        icon={
          <DesktopOutlined style={{ fontSize: '1rem', color: '#1677ff' }} />
        }
        type='text'
        onClick={() => props.handleClick?.()}
      />
    </Tooltip>
  );
};

export const NetIconLan = (props: IProps) => {
  return (
    <Tooltip title='优先跳转内网地址'>
      <Button
        icon={<GlobalOutlined style={{ fontSize: '1rem' }} />}
        type='text'
        onClick={() => props.handleClick?.()}
      />
    </Tooltip>
  );
};
