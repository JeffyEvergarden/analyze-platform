import { request } from 'umi';

// 获取总揽数据
export const getTableList = async (params?: any) => {
  return request(`/bgs/analysis/table/list`, {
    method: 'get',
    params,
  });
};
