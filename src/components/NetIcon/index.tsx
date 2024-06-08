import { DesktopOutlined, GlobalOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

export interface IProps {
  handleClick: () => void;
}

export const NetIconWan = (props: IProps) => {
  return (
    <Tooltip title="公网地址优先跳转">
      <Button
        icon={
          <DesktopOutlined style={{ fontSize: '1rem', color: '#1677ff' }} />
        }
        type="default"
        onClick={() => props.handleClick?.()}
      />
    </Tooltip>
  );
};

export const NetIconLan = (props: IProps) => {
  return (
    <Tooltip title="内网地址优先跳转">
      <Button
        icon={<GlobalOutlined style={{ fontSize: '1rem' }} />}
        type="default"
        onClick={() => props.handleClick?.()}
      />
    </Tooltip>
  );
};
