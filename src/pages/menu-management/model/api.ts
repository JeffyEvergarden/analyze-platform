import { request } from 'umi';

/** 获取属性映射列表 **/
export async function getMenuList(params?: { [key: string]: any }) {
  return request('/management/menu', {
    method: 'GET',
    params,
  });
}
