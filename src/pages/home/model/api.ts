import { request } from 'umi';

/** 获取事件列表 **/
export async function getHomeList(params?: { [key: string]: any }) {
  return request('/home/list', {
    method: 'GET',
    params,
  });
}

/** 获取属性映射列表 **/
export async function getMenuList(params?: { [key: string]: any }) {
  return request('/home/menu', {
    method: 'GET',
    params,
  });
}
