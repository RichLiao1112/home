'use client';

import { ICard, ILayout } from '@/services/home';
import React, {
  createContext,
  useState,
  FC,
  memo,
  useCallback,
  useMemo,
} from 'react';

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
    data: ILayout;
    title: string;
  };
  setEditDrawerData: (
    payload: IPageContext['editDrawerData'] | undefined
  ) => void;
}

export const PageContext = createContext<Partial<IPageContext>>({});

export const PageContextProvider: FC<any> = (props) => {
  const [editCardMode, modifyEditCardMode] = useState(false);
  const [editModalData, modifyEditModalData] =
    useState<IPageContext['editModalData']>();
  const [editDrawerData, modifyEditDrawerData] =
    useState<IPageContext['editDrawerData']>();

  const setEditCardMode = useCallback(
    (payload: boolean) => modifyEditCardMode(payload),
    []
  );
  const setEditModalData = useCallback(
    (payload: IPageContext['editModalData'] | undefined) =>
      modifyEditModalData(payload),
    []
  );
  const setEditDrawerData = useCallback(
    (payload: IPageContext['editDrawerData'] | undefined) =>
      modifyEditDrawerData(payload),
    []
  );

  const value = useMemo(() => {
    return {
      editCardMode,
      setEditCardMode,
      editModalData,
      setEditModalData,
      editDrawerData,
      setEditDrawerData,
    };
  }, [editCardMode, editModalData, editDrawerData]);

  return (
    <PageContext.Provider value={value}>{props.children}</PageContext.Provider>
  );
};
