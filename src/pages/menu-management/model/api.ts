import { request } from '@/services/request';

/** 获取菜单列表 **/
export async function getMenuList(params?: { [key: string]: any }) {
  return request('/management/menu', {
    method: 'GET',
    params,
  });
}

/** 获取模块列表 **/
export async function getModuleList(params?: { [key: string]: any }) {
  return request(`/bd/dashboard/board/list/${params?.id}`, {
    method: 'GET',
    params,
  });
}

// 删除链接
export async function deleteLink(data?: { [key: string]: any }) {
  return request(`/bd/dashboard/analysis/delete/${data?.id}`, {
    method: 'DELETE',
    data,
  });
}

// 新增链接
export async function addNewLink(data?: { [key: string]: any }) {
  return request('/management/menu/add', {
    method: 'POST',
    data,
  });
}

// 新增链接
export async function updateLink(data?: { [key: string]: any }) {
  return request('/management/menu/update', {
    method: 'POST',
    data,
  });
}

// 新增目录

export async function createDir(data?: { [key: string]: any }) {
  return request('/bd/dashboard/dir/create', {
    method: 'POST',
    data,
  });
}

// 修改目录
export async function modifyDir(data?: { [key: string]: any }) {
  return request('/bd/dashboard/dir/modify', {
    method: 'POST',
    data,
  });
}

// 删除目录
export async function deleteDir(data?: { [key: string]: any }) {
  return request(`/bd/dashboard/Dir/delete/{${data?.id}}`, {
    method: 'DELETE',
    data,
  });
}

// 新增看板

export async function createBoard(data?: { [key: string]: any }) {
  return request('/bd/dashboard/board/create', {
    method: 'POST',
    data,
  });
}

// 修改看板
export async function modifyBoard(data?: { [key: string]: any }) {
  return request('/bd/dashboard/board/modify', {
    method: 'POST',
    data,
  });
}

// 删除看板
export async function deleteBoard(data?: { [key: string]: any }) {
  return request(`/bd/dashboard/board/delete/{${data?.id}}`, {
    method: 'DELETE',
    data,
  });
}
