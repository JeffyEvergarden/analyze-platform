import { request } from '@/services/request';

export async function getDashboard(data: any) {
  return request('/bd/dashboard/dir/public/list', {
    method: 'GET',
  });
}

export async function getTeamDashboard(data: any) {
  return request('/bd/dashboard/dir/team/list', {
    method: 'GET',
  });
}

export async function getPersonalDashboard(data: any) {
  return request('/bd/dashboard/dir/personal/list', {
    method: 'GET',
  });
}
export async function getModuleData(id: any) {
  return request('/bd/dashboard/analysis/detail/' + id, {
    method: 'GET',
  });
}
