// 筛选框 - 关联主体 - 下拉列表
export const userTypeList: any[] = [
  {
    name: '用户',
    value: '01',
  },
  {
    name: '借据',
    value: '02',
  },
  {
    name: 'BO号',
    value: '03',
  },
];

// 对比查看 - 分组
export const groupByList: any[] = [
  {
    value: 'strategy_id',
    dataIndex: 'strategy_id',
    title: '策略ID',
    name: '策略ID',
  },
  {
    dataIndex: 'strategy_name',
    value: 'strategy_name',
    title: '策略名称',
    name: '策略名称',
  },
  {
    dataIndex: 'approve_status',
    value: 'approve_status',
    title: '实名状态',
    name: '实名状态',
  },
  {
    dataIndex: 'version_name',
    value: 'version_name',
    title: '版本名称',
    name: '版本名称',
  },
  {
    dataIndex: 'push_name',
    value: 'push_name',
    title: '触达方式',
    name: '触达方式',
  },
  {
    dataIndex: 'send_date',
    value: 'send_date',
    title: '发送日期',
    name: '发送日期',
  },
  {
    dataIndex: 'interval_second',
    value: 'interval_second',
    title: '初始行为窗口期',
    name: '初始行为窗口期',
  },
  {
    dataIndex: 'channel_name',
    value: 'channel_name',
    title: '进件渠道',
    name: '进件渠道',
  },
  {
    dataIndex: 'prod_name',
    value: 'prod_name',
    title: '产品名称',
    name: '产品名称',
  },
];

// 对比查看 - 统计方式
export const timeUnitList: any[] = [
  {
    name: '日',
    value: 'day',
  },
  // {
  //   name: '月',
  //   value: 'month',
  // },
  // {
  //   name: '年',
  //   value: 'year',
  // },
];

// 对比查看 - 统计方式
export const timeUnit2List: any[] = [
  {
    name: '天',
    value: 'day',
  },
  // {
  //   name: '月',
  //   value: 'month',
  // },
  // {
  //   name: '年',
  //   value: 'year',
  // },
];
