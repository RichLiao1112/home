'use client';

import { jumpMode } from '@/common';
import { ICard, ILayout } from '@/services/home';
import React, {
  createContext,
  useState,
  FC,
  useCallback,
  useMemo,
} from 'react';

export interface IPageContext {
  editCardMode: boolean;
  setEditCardMode: (bool: boolean) => void;
  editModalData: {
    open: boolean;
    title: string;
    data: Partial<ICard>;
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
  linkMode: string | null;
  setLinkMode: (payload: string) => void;
}

export const PageContext = createContext<Partial<IPageContext>>({});

export const PageContextProvider: FC<any> = (props) => {
  const [editCardMode, modifyEditCardMode] = useState(false);
  const [editModalData, modifyEditModalData] =
    useState<IPageContext['editModalData']>();
  const [editDrawerData, modifyEditDrawerData] =
    useState<IPageContext['editDrawerData']>();
  const [linkMode, modifyLinkMode] = useState<string>(jumpMode.wan);

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
  const setLinkMode = useCallback(
    (payload: string) => modifyLinkMode(payload),
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
      linkMode,
      setLinkMode,
    };
  }, [editCardMode, editModalData, editDrawerData, linkMode]);

  return (
    <PageContext.Provider value={value}>{props.children}</PageContext.Provider>
  );
};
