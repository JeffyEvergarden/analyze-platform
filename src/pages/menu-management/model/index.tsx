import { useState } from 'react';
import { getMenuList } from './api';

// 菜单管理界面
// ------
export const useMenuModel = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [menuList, setMenuList] = useState<any[]>([]);

  const getMenuList = async () => {
    setLoading(true);
    let res: any = await getMenuList();
    setLoading(false);
    let { data = [] } = res;
    setMenuList(data || []);
  };

  return {
    menuList,
    getMenuList,
    setMenuList,
    loading,
  };
};
