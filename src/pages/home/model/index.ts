import { useState } from 'react';
import { getHomeList, getMenuList as getMenu } from './api';
import MenuList from '../components/other-view/config';

// 统一门户 跳转数据源
export const useMenuModel = () => {
  const [loading1, setLoading1] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);

  const [myList, setMyList] = useState<any[]>([]);
  const [menuList, setMenuList] = useState<any[]>([]);

  const getMyList = async () => {
    setLoading1(true);
    let res: any = await getHomeList();
    setLoading1(false);
    let { data = [] } = res;
    console.log(data);
    setMyList(data);
  };

  const getMenuList = () => {
    setMenuList(MenuList);
  };

  return {
    myList,
    menuList,
    getMyList,
    getMenuList,
    setMyList,
    setMenuList,
    loading1,
    loading2,
  };
};
