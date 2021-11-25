import { useState } from 'react';
import { getMenuList as getMenu, getModuleList, addNewLink, deleteLink } from './api';
import { message } from 'antd';
// 菜单管理界面
// ------
export const useMenuModel = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [menuList, setMenuList] = useState<any[]>([]);

  const getMenuList = async () => {
    setLoading(true);
    let res: any = await getMenu();
    setLoading(false);
    let { data = [] } = res;
    console.log(data);
    setMenuList(data || []);
  };

  return {
    menuList,
    getMenuList,
    setMenuList,
    loading,
  };
};

export const useTableModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [opLoading, setOpLoading] = useState<boolean>(false);

  const getTableList = async (params: any) => {
    setTableLoading(true);
    let res: any = await getModuleList(params);
    setTableLoading(false);
    let { data = [] } = res;
    console.log('tableList', data);
    setTableList(data || []);
  };

  // 添加新链接
  const addModuleLink = async (params: any) => {
    setOpLoading(true);
    let res: any = await addNewLink(params);
    setOpLoading(false);
    if (res?.code === 200) {
      message.success('添加成功');
      return {
        id: '1234',
        index: tableList.length + 1,
        title: 'asdasdasda',
        link: 'www.baidu.com',
      };
    } else {
      return {};
    }
  };
  // 删除链接
  const deleteModuleLink = async (params: any) => {
    setOpLoading(true);
    let res: any = await deleteLink(params);
    setOpLoading(false);
    if (res?.code === 200) {
      message.success('添加成功');
      return true;
    } else {
      message.success('发生未知系统异常');
      return false;
    }
  };

  return {
    tableList,
    setTableList,
    tableLoading,
    opLoading,
    getTableList,
    addModuleLink,
    deleteModuleLink,
  };
};
