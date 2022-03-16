export const modelTypeList: any[] = [
  {
    name: '广告投放效果分析-二期',
    value: '01',
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
    value: 'equal',
    name: '等于',
  },
  {
    value: 'notequal',
    name: '不等于',
  },
  {
    value: 'contain',
    name: '包含',
  },
  {
    value: 'not contain',
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
  {
    name: '分钟',
    value: 'minute',
  },
];
