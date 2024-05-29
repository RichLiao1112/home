'use client';

import { useState } from 'react';
import styles from './index.module.css';
import { ColorPicker, Input } from 'antd';

export interface IProps {
  onChange?: (value?: string) => void;
  value?: string;
}

export default function SelectColor(props: IProps) {
  const { onChange, value } = props;
  const [colors] = useState<Array<string>>([
    '#e11d48',
    '#db2777',
    '#c026d3',
    '#7c3aed',
    '#4f46e5',
    '#0284c7',
    '#0891b2',
    '#059669',
    '#65a30d',
    '#eab308',
    '#ea580c',
    '#dc2626',
    '#000000',
    '#333333',
    '#666666',
    '#999999',
    '#cccccc',
    '#ffffff',
  ]);

  return (
    <div>
      <div className={styles.selected}>
        <ColorPicker
          value={value}
          onChange={(value) => onChange?.(value.toHexString())}
        />
        <Input value={value} onChange={(e) => onChange?.(e.target.value)} />
      </div>
      <div className={styles.colors}>
        {colors.map((item) => (
          <div
            key={item}
            className={styles.color}
            onClick={() => onChange?.(item)}
            style={{ backgroundColor: item }}
          />
        ))}
      </div>
    </div>
  );
}
