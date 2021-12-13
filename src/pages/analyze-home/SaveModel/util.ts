import { getDashboard, getTeamDashboard, getPersonalDashboard, getModuleData } from './modal/api';
import { message } from 'antd';

const getPublicDashboardData = async () => {
  const temp = {
    title: '公共目录',
    disabled: true,
    value: 'public',
    children: [],
  };
  let arr: any[] = [];
  return getDashboard({})
    .then((res) => {
      const resCode = res?.resultCode;
      if (resCode === '000') {
        const data = res?.datas || [];
        data.map((item: any) => {
          const tmp: any = {
            title: item?.dirName,
            disabled: true,
            value: item?.dirId,
            children: [],
          };
          item?.dashboards?.map((cell: any) => {
            arr.push(cell?.dashboardId);
            tmp?.children?.push({
              title: cell?.dashboardName,
              key: item?.dashboardId,
              value: cell?.dashboardId,
            });
          });
          temp.children.push(tmp);
        });
        return temp;
      } else {
        message.error('获取公共目录失败');
      }
    })
    .catch((err: any) => {
      message.error('获取公共目录错误');
    });
};

const getTeamDashboardData = async () => {
  const temp = {
    title: '团队目录',
    disabled: true,
    value: 'team',
    children: [],
  };
  return getTeamDashboard({})
    .then((res) => {
      const resCode = res?.resultCode;
      if (resCode === '000') {
        const data = res?.datas || [];
        data.map((item: any) => {
          const tmp: any = {
            title: item?.dirName,
            disabled: true,
            value: item?.dirId,
            children: [],
          };
          item?.dashboards?.map((cell: any) => {
            // arr.push(cell?.dashboardId);
            tmp?.children?.push({
              title: cell?.dashboardName,
              key: item?.dashboardId,
              value: cell?.dashboardId,
            });
          });
          temp.children.push(tmp);
        });
        return temp;
      } else {
        message.error('获取团队目录失败');
      }
    })
    .catch((err: any) => {
      message.error('获取团队目录错误');
    });
};

const getpersonalDashboardData = async () => {
  const temp = {
    title: '个人目录',
    disabled: true,
    value: 'personal',
    children: [],
  };
  return getPersonalDashboard({})
    .then((res) => {
      const resCode = res?.resultCode;
      if (resCode === '000') {
        const data = res?.datas || [];
        data?.map((item: any) => {
          if (item.dirType != 'receive') {
            const tmp: any = {
              title: item?.dirName,
              disabled: true,
              value: item?.dirId,
              children: [],
            };
            item?.dashboards?.map((cell: any) => {
              // arr.push(cell.dashboardId);
              tmp?.children?.push({
                title: cell?.dashboardName,
                key: item?.dashboardId,
                value: cell?.dashboardId,
              });
            });
            temp?.children?.push(tmp);
          }
        });
        return temp;
      } else {
        message.error('获取个人目录失败');
      }
    })
    .catch((err: any) => {
      message.error('获取个人目录错误');
    });
};

export async function getTreeSelect() {
  const [a, b, c] = await Promise.all([
    getPublicDashboardData(),
    getTeamDashboardData(),
    getpersonalDashboardData(),
  ]);
  return [a, b, c];
}

export async function getModuleDetail(id: string) {
  return getModuleData(id);
}
