'use client';

import React, {
  createContext,
  useState,
  FC,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

export interface IAuthContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  authEnabled: boolean;
  setAuthEnabled: (value: boolean) => void;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  authEnabled: false,
  setAuthEnabled: () => {},
  login: async () => false,
  logout: async () => {},
  loading: true,
});

export const AuthContextProvider: FC<any> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEnabled, setAuthEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // 检查认证状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 获取认证配置
        const statusRes = await fetch('/api/auth/status', { method: 'GET' });
        const statusData = await statusRes.json();

        if (statusData.data?.enabled) {
          setAuthEnabled(true);
          // 检查是否已登录（通过 cookie）
          // 如果有 cookie，说明已登录
          const hasCookie = document.cookie.includes('auth_token');
          setIsAuthenticated(hasCookie);
        } else {
          setAuthEnabled(false);
          setIsAuthenticated(true); // 未开启认证时，默认已认证
        }
      } catch (error) {
        console.error('Check auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const value = useMemo(() => {
    return {
      isAuthenticated,
      setIsAuthenticated,
      authEnabled,
      setAuthEnabled,
      login,
      logout,
      loading,
    };
  }, [isAuthenticated, authEnabled, login, logout, loading]);

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
