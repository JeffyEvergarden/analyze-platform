export const modelTypeList: any[] = [
  {
    name: '广告投放效果分析-二期',
    value: '01',
  },
];

//通用
export const OperatorList: any[] = [
  {
    name: '求和',
    value: 'SUM',
  },
  {
    name: '最大',
    value: 'MAX',
  },
  {
    name: '最小',
    value: 'MIN',
  },
  {
    name: '次均',
    value: 'AVG',
  },
  {
    name: '人均',
    value: 'DISTINCT_AVG',
  },
  {
    name: '去重',
    value: 'COUNT_DISTINCT',
  },
];

export const statisticNumbericList: any[] = [
  {
    name: '求和',
    value: 'SUM',
  },
  {
    name: '最大',
    value: 'MAX',
  },
  {
    name: '最小',
    value: 'MIN',
  },
  {
    name: '次均',
    value: 'AVG',
  },
  {
    name: '人均',
    value: 'DISTINCT_AVG',
  },
];

export const statisticNumbericListForImpala: any[] = [
  {
    name: '求和',
    value: 'SUM',
  },
  {
    name: '最大',
    value: 'MAX',
  },
  {
    name: '最小',
    value: 'MIN',
  },
  {
    name: '次均',
    value: 'AVG',
  },
];

// 筛选框 - 数据库属性 - 默认统计方式
export const statisticDefaultList: any[] = [
  {
    name: '去重',
    value: 'COUNT_DISTINCT',
  },
];

// 子筛选框- 操作 - 数字下拉

export const numberTypeList: any[] = [
  {
    value: '=',
    name: '等于',
  },
  {
    value: '!=',
    name: '不等于',
  },
  {
    value: '>=',
    name: '大于等于',
  },
  {
    value: '>',
    name: '大于',
  },
  {
    value: '<=',
    name: '小于等于',
  },
  {
    value: '<',
    name: '小于',
  },
];

// 子筛选框- 数组 - 字符串

export const arrayTypeList: any[] = [
  {
    value: '=',
    name: '等于',
  },
  {
    value: '!=',
    name: '不等于',
  },
  {
    value: 'in',
    name: '包含',
  },
  {
    value: 'not in',
    name: '不包含',
  },
];

export const stringTypeList: any[] = [
  {
    value: '=',
    name: '等于',
  },
  {
    value: '!=',
    name: '不等于',
  },
];

// 对比查看 - 统计方式
export const timeUnitList: any[] = [
  {
    name: '天',
    value: 'day',
  },
  {
    name: '小时',
    value: 'hour',
  },
  // {
  //   name: '分钟',
  //   value: 'minute',
  // },
];

// 标题列表
export const TitleList: any[] = [
  {
    key: 'advertchannel',
    label: '广告投放渠道',
  },
];

// 补充字段
export const ExtraList: any[] = [
  {
    value: 'event_occur_time',
    name: '事件发生日期',
  },
];
