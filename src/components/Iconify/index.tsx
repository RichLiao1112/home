import { Icon } from '@iconify-icon/react';

export interface IProps {
  width?: string;
  height?: string;
  icon: string;
}

export default function Iconify(props: IProps) {
  const { width = '2rem', height = '2rem', icon = 'token:dsm' } = props;
  return <Icon width={width} height={height} icon={icon} />;
}
