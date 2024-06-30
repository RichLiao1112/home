'use client';

import React, { ReactNode, useRef } from 'react';
import { ICard } from '@/services/home';
import { useDrag, useDrop } from 'react-dnd';

export interface IProps {
  children?: ReactNode;
  item: any;
  index: number;
  moveItem: (currentIndex: number, targetIndex: number) => void;
}
const Drag = (props: IProps) => {
  const ref = useRef(null);

  const { item, index, moveItem } = props;

  const [, drop] = useDrop({
    accept: 'DRAG',
    hover: (draggedItem: ICard & { index: number }) => {
      if (draggedItem.index !== index) {
        if (moveItem) {
          moveItem(draggedItem.index, index);
        }
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
    end: (v, mo) => {
      console.log(v, mo);
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.2 : 1 }}>
      {props.children}
    </div>
  );
};
export default Drag;
