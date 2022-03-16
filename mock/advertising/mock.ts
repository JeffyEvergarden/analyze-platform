import { Request, Response } from 'express';

const fetchMetricsInfo = (req: any, res: any) => {
  return res.json(metricsData);
};

const fetchFieldInfo = (req: any, res: any) => {
  return res.json(fieldInfo);
};

const metricsData = [
  {
    id: '1',
    code: 'LQHTXCG',
    name: '命运冠位指定',
    fields: [
      {
        canGroupBy: '1',
        id: '1',
        code: 'select',
        name: '下拉框',
        dataType: 'string',
        dictCode: 'select',
        createdTime: '1111-11-11',
        updateTime: '2222-22-22',
      },
      {
        canGroupBy: '1',
        id: '1',
        code: 'select2',
        name: '下拉框2',
        dataType: 'string',
        dictCode: 'select2',
      },
      {
        canGroupBy: '1',
        id: '2',
        code: 'input',
        name: '输入框',
        dataType: 'string',
        dictCode: undefined,
      },
      {
        canGroupBy: '1',
        id: '3',
        code: 'dateTime',
        name: '时间选择器',
        dataType: 'dateTime',
        dictCode: undefined,
      },
      {
        canGroupBy: '1',
        id: '4',
        code: 'numbr',
        name: '数字框',
        dataType: 'numbric',
        dictCode: undefined,
      },
    ],
    metrics: [
      {
        name: '用户数',
        expression: '用户数',
      },
      {
        name: '提现成功人数',
        expression: '户均提现成功金额',
      },
      {
        name: '提现成功笔数',
        expression: '提现成功笔数',
      },
    ],
  },
  {
    id: '2',
    code: 'LBQ',
    name: '原神',
    fields: [
      {
        canGroupBy: '1',
        id: '1',
        code: 'select',
        name: '下拉框',
        dataType: 'string',
        dictCode: 'select',
      },
      {
        canGroupBy: '1',
        id: '2',
        code: 'input',
        name: '输入框',
        dataType: 'string',
        dictCode: undefined,
      },
      {
        canGroupBy: '1',
        id: '3',
        code: 'dateTime',
        name: '时间选择器',
        dataType: 'dateTime',
        dictCode: undefined,
      },
      {
        canGroupBy: '1',
        id: '4',
        code: 'number',
        name: '数字框',
        dataType: 'numbric',
        dictCode: undefined,
      },
    ],
    metrics: [
      {
        name: '用户数',
        expression: '用户数',
      },
      {
        name: '提现成功人数',
        expression: '户均提现成功金额',
      },
      {
        name: '提现成功笔数',
        expression: '提现成功笔数',
      },
    ],
  },
];

const fieldInfo = [
  {
    code: '1',
    dicts: [
      { name: '测试1', value: '测试1' },
      { name: '测试2', value: '测试2' },
    ],
  },
  {
    code: '2',
    dicts: [
      { name: '测试3', value: '测试3' },
      { name: '测试4', value: '测试4' },
    ],
  },
  {
    code: 'strategy_id',
    dicts: [
      { name: '测试5', value: '测试5' },
      { name: '测试6', value: '测试6' },
    ],
  },
  {
    code: 'prod_name',
    dicts: [
      { name: '测试7', value: '测试7' },
      { name: '测试8', value: '测试8' },
    ],
  },
  {
    code: 'activity_id',
    dicts: [
      { name: '测试9', value: '测试9' },
      { name: '测试10', value: '测试10' },
    ],
  },
  {
    code: 'prod_code',
    dicts: [
      { name: '测试11', value: '测试11' },
      { name: '测试12', value: '测试12' },
    ],
  },
  {
    code: 'time',
    dicts: [
      { name: '测试13', value: '测试13' },
      { name: '测试14', value: '测试14' },
    ],
  },
];

export default {
  'GET /bd/analysis/dict/events': fetchMetricsInfo,
  'GET /bd/analysis/dict/fields': fetchFieldInfo,
};
