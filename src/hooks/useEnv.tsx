'use client';

import React, { useEffect, useState } from 'react';
import { apiGetHHENV } from '@/requests';

// 全局缓存变量
let cachedEnv: any = undefined;
let cachedPromise: Promise<any> | null = null;

const useEnv = () => {
  const [env, setEnv] = useState<any>(cachedEnv);

  useEffect(() => {
    if (cachedEnv !== undefined) {
      setEnv(cachedEnv);
      return;
    }
    if (!cachedPromise) {
      cachedPromise = apiGetHHENV().then(res => {
        cachedEnv = res.data;
        setEnv(res.data);
        return res.data;
      });
    } else {
      cachedPromise.then(res => {
        cachedEnv = res;
        setEnv(res);
      });
    }
  }, []);

  return { env };
};

export default useEnv;
