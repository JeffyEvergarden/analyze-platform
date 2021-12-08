import { request } from 'umi';

/** 获取事件列表 **/
export async function getEventList(params?: { [key: string]: any }) {
  return request('/bgs/analysis/events/dict', {
    method: 'GET',
    params,
  });
}

/** 获取事件列表 **/
export async function getBehaviorList(params?: { [key: string]: any }) {
  return request('/bgs/analysis/behavior/dict', {
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
export async function getRefreshList(data: any) {
  return request('/bgs/retain/query', {
    method: 'POST',
    data,
  });
}
