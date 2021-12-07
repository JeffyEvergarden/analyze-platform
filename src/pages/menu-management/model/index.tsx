import { useState } from 'react';
import {
  getMenuList as getMenu,
  getModuleList,
  addNewLink,
  deleteLink,
  createDir,
  modifyDir,
  createBoard,
  modifyBoard,
} from './api';
import { message } from 'antd';

const successCode = '000';

// 菜单管理界面
// ------
export const useMenuModel = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [menuList, setMenuList] = useState<any[]>([]);

  // 数据格式化
  const giveLevel = (arr: any[], level: number, parent?: any) => {
    if (!Array.isArray(arr)) {
      return [];
    }
    let newArr = arr.map((item: any, index: any) => {
      const obj: any = {
        level: level, // 树级
        parent: parent, // 父节点
        title: item.dirName || item.dashboardName, // 名称
        id: item.dirId || item.dashboardId, // id
        key: `${parent?.key || ''}_${index}`, // id
        parentId: parent?.id, // 父节点id
        children: item.dashboards,
        type: item.dirType,
        _origin: item,
      };
      if (level >= 2) {
        obj.isLeaf = true;
      }
      if (obj.children && Array.isArray(obj.children)) {
        obj.children = giveLevel(obj.children, level + 1, obj);
      }
      return obj;
    });
    return newArr;
  };

  // 加工数据
  const processData = (arr: []) => {
    let newArr: any[] = giveLevel(arr, 1, undefined);
    console.log(newArr);
    return newArr;
  };

  // 加载菜单数据
  const getMenuList = async () => {
    setLoading(true);
    let res: any = await getMenu();
    setLoading(false);
    let { data = [] } = res;
    data = processData(data);
    // console.log(data);
    setMenuList(data || []);
  };

  // 添加目录
  const addDir = async (data: any) => {
    let res: any = await createDir(data);
    if (res?.code === successCode) {
      message.success('添加成功');
      return true;
    } else {
      message.success('发生未知系统异常');
      return false;
    }
  };

  // 修改目录
  const updateDir = async (data: any) => {
    let res: any = await modifyDir(data);
    if (res?.code === successCode) {
      message.success('添加成功');
      return true;
    } else {
      message.success('发生未知系统异常');
      return false;
    }
  };

  // 创建目录
  const addBoard = async (data: any) => {
    let res: any = await createBoard(data);
    if (res?.code === successCode) {
      message.success('添加成功');
      return true;
    } else {
      message.success('发生未知系统异常');
      return false;
    }
  };

  // 创建目录
  const updateBoard = async (data: any) => {
    let res: any = await modifyBoard(data);
    if (res?.code === successCode) {
      message.success('添加成功');
      return true;
    } else {
      message.success('发生未知系统异常');
      return false;
    }
  };

  return {
    menuList,
    getMenuList,
    setMenuList,
    loading,
    addDir,
    updateDir,
    addBoard,
    updateBoard,
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
    data = data.map((item: any, index: any) => {
      item.index = index;
      return item;
    });
    console.log('tableList', data);
    setTableList(data || []);
  };

  // 添加新链接
  const addModuleLink = async (params: any) => {
    setOpLoading(true);
    let res: any = await addNewLink(params);
    setOpLoading(false);
    if (res?.code === successCode) {
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
    if (res?.code === successCode) {
      message.success('删除成功');
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
