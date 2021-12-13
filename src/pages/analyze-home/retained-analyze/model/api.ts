import { request } from 'umi';

// 获取总揽数据
export const getTableList = async (params?: any) => {
  return request(`/bgs/analysis/table/list`, {
    method: 'get',
    params,
  });
};

/** 获取事件列表 **/
export async function getEventList(params?: { [key: string]: any }) {
  return request('/bgs/analysis/retain/events/dict', {
    method: 'GET',
    params,
  });
}

/** 获取后续列表 **/
export async function getBehaviorList(params?: { [key: string]: any }) {
  return request('/bgs/analysis/retain/behavior/dict', {
    method: 'GET',
    params,
  });
}

/** 获取属性映射列表 **/
export async function getFieldList(params?: { [key: string]: any }) {
  return request('/bgs/analysis/dict/fields', {
    method: 'GET',
    params,
  });
}

/** 刷新列表 **/
export async function getRefreshList(params: any) {
  return request('/bgs/retain/query', {
    method: 'POST',

    data: params,
  });
}

//保存
export async function saveAnalysisModule(data: any) {
  return request('/bgs/dashboard/analysis/create', {
    method: 'POST',
    data,
  });
}
