import { request } from 'umi';

/** 获取属性映射列表 **/
export async function getIpList(params?: { [key: string]: any }) {
  return request('/management/ip', {
    method: 'GET',
    params,
  });
}

// 删除ip
export async function deleteIp(data?: { [key: string]: any }) {
  return request('/management/ip/delete', {
    method: 'POST',
    data,
  });
}

// 新增IP
export async function addIp(data?: { [key: string]: any }) {
  return request('/management/ip/add', {
    method: 'POST',
    data,
  });
}
