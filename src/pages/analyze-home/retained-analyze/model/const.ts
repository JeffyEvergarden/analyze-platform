// 待选模型列表
// 筛选框 - 选择分析模型 - 下拉列表
export const modelTypeList: any[] = [
  {
    name: 'BGS策略分析',
    value: '01',
  },
  {
    name: '活动转化分析',
    value: '02',
  },
  {
    name: '普通事件分析',
    value: '03',
  },
];

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
    value: 'activity_id',
    name: '活动ID',
  },
  {
    value: 'activity_name',
    name: '活动名称',
  },
  {
    value: 'channel_num',
    name: '进件渠道号',
  },
  {
    value: 'mcht_code',
    name: '商户号',
  },
];

// 对比查看 - 统计方式
export const timeUnitList: any[] = [
  {
    name: '日',
    value: 'day',
  },
  {
    name: '月',
    value: 'month',
  },
  {
    name: '年',
    value: 'year',
  },
];

// 对比查看 - 统计方式
export const timeUnit2List: any[] = [
  {
    name: '天',
    value: 'day',
  },
  {
    name: '月',
    value: 'month',
  },
  {
    name: '年',
    value: 'year',
  },
];
