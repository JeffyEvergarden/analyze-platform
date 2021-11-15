import { request } from 'umi';

/** 获取事件列表 **/
export async function getEventList(params?: { [key: string]: any }) {
  return request('/bgs/analysis/dict/events', {
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
