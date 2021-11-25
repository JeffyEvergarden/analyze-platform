import { useState } from 'react';
import { getIpList as getIp, deleteIp, addIp } from './api';
import { message } from 'antd';

// 白名单管理-数据源
// ------
export const useIpModel = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [list, setList] = useState<any[]>([]);

  const getIpList = async () => {
    setLoading(true);
    let res: any = await getIp();
    setLoading(false);
    let { data = [] } = res;
    console.log(data);
    setList(data || []);
  };

  const deleteIpAddress = async (id: string) => {
    let res: any = await deleteIp({ id });
    if (res.code === 200) {
      message.success('删除成功');
      return true;
    }
    message.warning('删除发售未知系统异常');
    return false;
  };

  const addIpAddress = async (id: string) => {
    let res: any = await addIp({ id });
    if (res.code === 200) {
      message.success('添加成功');
      return {
        id: list.length + 1,
        ip: 'fake',
      };
    }
    message.warning('添加失败');
    return {};
  };

  return {
    list,
    setList,
    getIpList,
    loading,
    addIpAddress,
    deleteIpAddress,
  };
};
