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

// 筛选框 - 数据库属性 - 可选统计方式

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
    value: '==',
    name: '等于',
  },
  {
    value: '!==',
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
    value: '==',
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
    value: '==',
    name: '等于',
  },
  {
    value: '!=',
    name: '不等于',
  },
];
