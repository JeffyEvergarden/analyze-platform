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
