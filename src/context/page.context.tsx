'use client';

import { ICard } from '@/services/home';
import React, { createContext, useState, FC } from 'react';

export interface IPageContext {
  editCardMode: boolean;
  setEditCardMode: (bool: boolean) => void;
  editModalData: {
    title: string;
    data: ICard;
    open: boolean;
  };
  setEditModalData: (
    payload: IPageContext['editModalData'] | undefined
  ) => void;
}

export const PageContext = createContext<Partial<IPageContext>>({});

export const PageContextProvider: FC<any> = (props) => {
  const [editCardMode, setEditCardMode] = useState(false);
  const [editModalData, setEditModalData] =
    useState<IPageContext['editModalData']>();
  return (
    <PageContext.Provider
      value={{
        editCardMode,
        setEditCardMode,
        editModalData,
        setEditModalData,
      }}
    >
      {props.children}
    </PageContext.Provider>
  );
};
