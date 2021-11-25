import { Request, Response } from 'express';

const getMenuList = (req: any, res: any) => {
  res.json({
    code: 200,
    data: [
      {
        title: '管理大屏',
        key: '0',
        type: '1',
        children: [
          {
            title: '业务类',
            key: '0-0',
            isLeaf: true,
            child: [
              {
                title: 'baidu',
                key: '0-0-0',
              },
              {
                title: 'bilibili',
                key: '0-0-1',
              },
              {
                title: 'fake',
                key: '0-0-2',
              },
            ],
          },
          {
            title: '经验分析类',
            key: '0-1',
            isLeaf: true,
            child: [
              {
                title: 'baidu',
                key: '0-1-0',
              },
              {
                title: 'bilibili',
                key: '0-1-1',
              },
              {
                title: 'fake',
                key: '0-1-2',
              },
            ],
          },
          {
            title: '分险欺诈类',
            key: '0-2',
            isLeaf: true,
            child: [
              {
                title: 'baidu',
                key: '0-2-0',
              },
              {
                title: 'bilibili',
                key: '0-2-1',
              },
              {
                title: 'fake',
                key: '0-2-2',
              },
            ],
          },
        ],
      },
      {
        title: 'fuck大屏',
        key: '2',
        type: '1',
        children: [],
      },
      {
        title: '分析业务',
        key: '1',
        children: [
          {
            title: '阳光',
            key: '1-0',
            isLeaf: true,
            child: [
              {
                title: 'baidu',
                key: '0-0-0',
              },
              {
                title: 'bilibili',
                key: '0-0-1',
              },
              {
                title: 'fake',
                key: '0-0-2',
              },
            ],
          },
          {
            title: '太阳',
            key: '1-1',
            isLeaf: true,
            child: [
              {
                title: 'baidu',
                key: '0-1-0',
              },
              {
                title: 'bilibili',
                key: '0-1-1',
              },
              {
                title: 'fake',
                key: '0-1-2',
              },
            ],
          },
          {
            title: '月亮',
            key: '1-2',
            isLeaf: true,
            child: [
              {
                title: 'baidu',
                key: '0-2-0',
              },
              {
                title: 'bilibili',
                key: '0-2-1',
              },
              {
                title: 'fake',
                key: '0-2-2',
              },
            ],
          },
        ],
      },
    ],
  });
};

const getIpList = (req: any, res: any) => {
  res.json({
    code: 200,
    data: [
      {
        id: 1,
        ip: '20.20.110.123',
      },
      {
        id: 2,
        ip: '20.20.110.123',
      },
      {
        id: 3,
        ip: '20.20.110.123',
      },
      {
        id: 4,
        ip: '20.20.110.123',
      },
      {
        id: 5,
        ip: '20.20.110.123',
      },
      {
        id: 6,
        ip: '20.20.110.123',
      },
      {
        id: 7,
        ip: '20.20.110.123',
      },
      {
        id: 8,
        ip: '20.20.110.123',
      },
      {
        id: 9,
        ip: '20.20.110.123',
      },
      {
        id: 10,
        ip: '20.20.110.123',
      },
      {
        id: 11,
        ip: '20.20.110.123',
      },
      {
        id: 12,
        ip: '20.20.110.123',
      },
    ],
  });
};

const addIp = (req: any, res: any) => {
  res.json({
    code: 200,
    data: {
      ip: 10,
    },
  });
};

const deleteIp = (req: any, res: any) => {
  res.json({
    code: 200,
    data: {},
  });
};

export default {
  'GET /management/menu': getMenuList,
  'GET /management/ip': getIpList,
  'POST /management/ip/add': addIp,
  'POST /management/ip/delete': deleteIp,
};
