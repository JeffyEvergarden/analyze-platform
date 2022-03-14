import { request } from 'umi';
/** 刷新列表 **/
export async function getRefreshList(params: any) {
  return request('/bd/retain/query', {
    method: 'POST',
    data: params,
  });
}
