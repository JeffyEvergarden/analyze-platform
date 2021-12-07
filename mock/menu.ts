import { Request, Response } from 'express';

const successCode = '000';

const getMenuList = (req: any, res: any) => {
  res.json({
    code: 200,
    data: [
      {
        dirName: '管理大屏',
        dirId: '0',
        type: '1',
        parentId: '100',
        dashboards: [
          {
            dashboardName: '业务类',
            dashboardId: '0-0',
            key: '0-0',
            isLeaf: true,
          },
          {
            dashboardName: '经验分析类',
            dashboardId: '0-1',
            isLeaf: true,
            icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-6ff5d5ccc24154bc38823529d353d474_hd.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640501958&t=c76186c40a5a100e12e94f92bf77bd62',
          },
          {
            dashboardName: '分险欺诈类',
            dashboardId: '0-2',
            isLeaf: true,
          },
        ],
      },
      {
        dirName: 'fuck大屏',
        dirId: '2',
        type: '1',
        dashboards: [],
      },
      {
        dirName: '分析业务',
        dirId: '1',
        dashboards: [
          {
            dashboardName: '阳光',
            dashboardId: '1-2',
            dashboardDir: '1',
            isLeaf: true,
          },
          {
            dashboardName: '太阳',
            dashboardId: '1-3',
            dashboardDir: '1',
            isLeaf: true,
          },
          {
            dashboardName: '月亮',
            dashboardId: '1-4',
            dashboardDir: '1',
            isLeaf: true,
          },
        ],
      },
    ],
  });
};

const getCurrentMenuList = (req: any, res: any) => {
  res.json({
    code: 200,
    datas: {
      analysisTemplates: [
        {
          id: 'fake13',
          name: 'fuck3',
          url: 'https://www.baidu.com',
          showType: 'leader',
          index: 10,
          icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-6ff5d5ccc24154bc38823529d353d474_hd.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640501958&t=c76186c40a5a100e12e94f92bf77bd62',
        },
        {
          id: 'fake2',
          analysisName: 'fuck2',
          analysisData: JSON.stringify({
            moduleType: 'ynf',
          }),
        },
        {
          id: 'fake',
          analysisName: 'fuck1',
          analysisData: JSON.stringify({
            moduleType: 'strategy',
          }),
        },
        {
          id: 'fake',
          analysisName: 'fuck4',
          analysisData: JSON.stringify({
            moduleType: 'activity',
          }),
        },
        {
          id: 'fake',
          analysisName: 'fuck5',
          analysisData: JSON.stringify({
            moduleType: 'sub_activity',
          }),
        },
        {
          id: 'fake',
          analysisName: 'fuck6',
          analysisData: JSON.stringify({
            analysisType: 'funnel',
          }),
        },
        {
          id: 'fake',
          analysisName: 'fuck7',
          analysisData: JSON.stringify({
            analysisType: 'superset',
          }),
        },
      ],
    },
  });
};

const addNewLink = (req: any, res: any) => {
  res.json({
    code: successCode,
    data: {
      id: 'fake',
      name: 'fuck',
      url: 'https://www.baidu.com',
      showType: 'leader',
      index: 10,
      icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-6ff5d5ccc24154bc38823529d353d474_hd.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640501958&t=c76186c40a5a100e12e94f92bf77bd62',
    },
  });
};

const deleteLink = (req: any, res: any) => {
  res.json({
    code: successCode,
    data: {},
  });
};

const updateLink = (req: any, res: any) => {
  res.json({
    code: successCode,
    data: {
      id: 10,
      name: 'fasdasdadad',
    },
  });
};

const createDir = (req: any, res: any) => {
  // dirName  // dirType
  res.json({
    code: successCode,
  });
};

export default {
  'GET /management/menu': getMenuList, // 获取所有模块
  'GET /bgs/dashboard/board/list/:id': getCurrentMenuList, // 获取当前子模块
  'POST /management/menu/add': addNewLink, // 添加模块
  'DELETE /bgs/dashboard/analysis/delete/:id`': deleteLink, // 删除模块
  'POST /management/menu/update': updateLink, // 修改模块
  'POST /bgs/dashboard/dir/create': createDir, // 创建目录
  'POST /bgs/dashboard/dir/modify': createDir, // 修改目录
  'DELETE /bgs/dashboard/dir/delete/:id': createDir, // 删除目录
  'POST /bgs/dashboard/board/create': createDir, // 创建看板
  'POST /bgs/dashboard/board/modify': createDir, // 修改看板
  'DELETE /bgs/dashboard/board/delete/:id': createDir, // 删除看板
};
