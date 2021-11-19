import { useState } from 'react';
import { getHomeList, getMenuList as getMenu } from './api';
// 统一门户 跳转数据源
export const useMenuModel = () => {
  const [loading1, setLoading1] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);

  const [myList, setMyList] = useState<any[]>([]);
  const [menuList, setMenuList] = useState<any[]>([]);

  const getMyList = async () => {
    let res: any = await getHomeList();
    let { data = [] } = res;
    console.log(data);
    setMyList(data);
  };

  const getMenuList = () => {};

  return {
    myList,
    menuList,
    getMyList,
    getMenuList,
    loading1,
    loading2,
  };
};
