import { Request, Response } from 'express';

const getEventList = (req: any, res: any) => {
  res.json([
    {
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
          code: 'number',
          name: '数字框',
          dataType: 'numberic',
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
          dataType: 'numberic',
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
  ]);
};

const getFieldList = (req: any, res: any) => {
  res.json([
    {
      code: 'select',
      dicts: [
        {
          name: '测试1',
          value: 'test1',
        },
        {
          name: '测试2',
          value: 'test2',
        },
      ],
    },
    {
      code: 'select2',
      dicts: [
        {
          name: '测试3',
          value: 'test3',
        },
        {
          name: '测试4',
          value: 'test4',
        },
      ],
    },
  ]);
};

export default {
  'GET /bgs/analysis/dict/events': getEventList,
  'GET /bgs/analysis/dict/fields': getFieldList,
};
