import { Button, Tooltip } from 'antd';
import Iconify from '../Iconify';

export interface IProps {
  handleClick: () => void;
}

export const NetIconWan = (props: IProps) => {
  return (
    <Tooltip title='公网地址优先跳转'>
      <Button
        icon={
          <span style={{ color: '#1677ff' }}>
            <Iconify icon='mdi:web-check' width='1rem' height='1rem' />
          </span>
        }
        type='default'
        onClick={() => props.handleClick?.()}
      />
    </Tooltip>
  );
};

export const NetIconLan = (props: IProps) => {
  return (
    <Tooltip title='内网地址优先跳转'>
      <Button
        icon={<Iconify icon='mdi:web-off' width='1rem' height='1rem' />}
        type='default'
        onClick={() => props.handleClick?.()}
      />
    </Tooltip>
  );
};
