import { request } from '@/services/request';

/** 获取事件列表 **/
export async function getEventList(params?: { [key: string]: any }) {
  return request('/bd/analysis/events/dict', {
    method: 'GET',
    params,
  });
}

/** 获取事件列表 **/
export async function getBehaviorList(params?: { [key: string]: any }) {
  return request('/bd/analysis/behavior/dict', {
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
export async function getRefreshList(data: any) {
  return request('/bd/retain/query', {
    method: 'POST',
    data,
  });
}
