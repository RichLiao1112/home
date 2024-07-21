'use client';

import React, { ReactNode, useRef } from 'react';
import { ICard } from '@/services/home';
import { useDrag, useDrop } from 'react-dnd';

export interface IProps {
  children?: ReactNode;
  item: any;
  index: number;
  moveItem: (
    current: { index: number; item: any },
    target: { index: number; item: any }
  ) => void;
  onEnd: (item: any) => void;
}
const Drag = (props: IProps) => {
  const ref = useRef(null);
  const { item, index, moveItem, onEnd } = props;

  const [, drop] = useDrop({
    accept: 'DRAG',
    hover: (draggedItem: ICard & { index: number }) => {
      if (draggedItem.index !== index) {
        if (moveItem) {
          moveItem(
            {
              item: draggedItem,
              index: draggedItem.index,
            },
            {
              item: item,
              index: index,
            }
          );
        }
        draggedItem.categoryId = item.categoryId;
        draggedItem.sort = item.sort - 100;
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'DRAG',
    item: { ...item, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (v) => onEnd?.(v),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.2 : 1 }}>
      {props.children}
    </div>
  );
};
export default Drag;
