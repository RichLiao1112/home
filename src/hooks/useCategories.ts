import { apiQueryCategories } from '@/requests';
import { ICategory } from '@/services/home';
import React, { useCallback, useEffect, useState } from 'react';

export default function useCategories() {
  const [keyMapCategory, setKeyMapCategory] =
    useState<Record<string, Array<Omit<ICategory, 'cards'>>>>();

  const fetchCategories = useCallback(() => {
    apiQueryCategories().then((res) => {
      const { data } = res;
      setKeyMapCategory(data);
    });
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  return [keyMapCategory];
}
