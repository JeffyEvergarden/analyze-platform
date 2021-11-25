import { request } from 'umi';

/** 获取属性映射列表 **/
export async function getMenuList(params?: { [key: string]: any }) {
  return request('/management/menu', {
    method: 'GET',
    params,
  });
}

/** 获取属性映射列表 **/
export async function getModuleList(params?: { [key: string]: any }) {
  return request('/management/menu', {
    method: 'GET',
    params,
  });
}

// 删除ip
export async function deleteLink(data?: { [key: string]: any }) {
  return request('/management/link/delete', {
    method: 'POST',
    data,
  });
}

// 新增IP
export async function addNewLink(data?: { [key: string]: any }) {
  return request('/management/link/add', {
    method: 'POST',
    data,
  });
}
