import { request } from '@/services/request';

export async function fetchMetricsInfo(params: any) {
  return request('/bd/analysis/dict/events', {
    method: 'get',
    params,
  });
}

export async function fetchFieldInfo() {
  return request('/bd/analysis/dict/fields', {
    method: 'get',
  });
}

export const getRequsetList = async (params: any) => {
  const id = typeof params === 'object' ? params.id : params || '';
  return request(`/bd/analysis/explore_activity_result/${id}`, {
    method: 'get',
    params,
  });
};

export async function sendMsg(data?: any, params?: any) {
  return request('/bd/analysis/explore_active', {
    method: 'post',
    data,
    params,
  });
}

export async function fetchSqlBaseInfo(params?: any) {
  return request('/bd/dashboard/analysis/config', {
    method: 'get',
    params,
  });
}

export async function getModuleData(id: any) {
  return request('/bd/dashboard/analysis/detail/' + id, {
    method: 'get',
  });
}

export async function updateModuleData(data: any) {
  return request('/bd/dashboard/analysis/modify/', {
    method: 'post',
    data,
  });
}
