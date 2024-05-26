'use client';

import { ICard, IHead } from '@/services/home';
import React, { createContext, useState, FC } from 'react';

export interface IPageContext {
  editCardMode: boolean;
  setEditCardMode: (bool: boolean) => void;
  editModalData: {
    open: boolean;
    title: string;
    data: ICard;
  };
  setEditModalData: (
    payload: IPageContext['editModalData'] | undefined
  ) => void;
  editDrawerData: {
    open: boolean;
    data: IHead;
    title: string;
  };
  setEditDrawerData: (
    payload: IPageContext['editDrawerData'] | undefined
  ) => void;
}

export const PageContext = createContext<Partial<IPageContext>>({});

export const PageContextProvider: FC<any> = (props) => {
  const [editCardMode, setEditCardMode] = useState(false);
  const [editModalData, setEditModalData] =
    useState<IPageContext['editModalData']>();
  const [editDrawerData, setEditDrawerData] =
    useState<IPageContext['editDrawerData']>();

  return (
    <PageContext.Provider
      value={{
        editCardMode,
        setEditCardMode,
        editModalData,
        setEditModalData,
        editDrawerData,
        setEditDrawerData,
      }}
    >
      {props.children}
    </PageContext.Provider>
  );
};
