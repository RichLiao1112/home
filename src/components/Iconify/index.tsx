import { Icon } from '@iconify-icon/react';

export interface IProps {
  width?: string;
  height?: string;
  icon: string;
  style?: CSSStyleSheet | any;
  className?: string | any;
  onClick?: () => void;
}

export default function Iconify(props: IProps) {
  const {
    width = '2rem',
    height = '2rem',
    icon = 'token:dsm',
    style,
    className,
    onClick,
  } = props;
  return (
    <Icon
      width={width}
      height={height}
      icon={icon}
      style={style}
      className={className}
      onClick={() => onClick?.()}
    />
  );
}
