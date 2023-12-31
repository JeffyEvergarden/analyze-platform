import { request } from '@/services/request';

// 获取总揽数据
export const getTableList = async (params?: any) => {
  return request(`/bd/analysis/table/list`, {
    method: 'get',
    params,
  });
};

/** 获取事件列表 **/
export async function getEventList(params?: { [key: string]: any }) {
  return request('/bd/analysis/retain/events/dict', {
    method: 'GET',
    params,
  });
}

/** 获取后续列表 **/
export async function getBehaviorList(params?: { [key: string]: any }) {
  return request('/bd/analysis/retain/behavior/dict', {
    method: 'GET',
    params,
  });
}

/** 获取属性映射列表 **/
export async function getFieldList(params?: { [key: string]: any }) {
  return request('/bd/analysis/dict/fields', {
    method: 'GET',
    params,
  });
}

/** 刷新列表 **/
export async function getRefreshList(params: any) {
  return request('/bd/retain/query', {
    method: 'POST',
    data: params,
  });
}

//保存
export async function saveAnalysisModule(data: any) {
  return request('/bd/dashboard/analysis/create', {
    method: 'POST',
    data,
  });
}

//编辑
export async function editAnalysisModule(data: any) {
  return request('/bd/dashboard/analysis/modify', {
    method: 'POST',
    data,
  });
}

//回显
export async function getModuleData(id: string) {
  return request('/bd/dashboard/analysis/detail/' + id, {
    method: 'get',
  });
}
