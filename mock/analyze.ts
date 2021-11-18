import { Request, Response } from 'express';

// 事件接口
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

// 待选下拉
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

// 留存分析-查值接口
const getTableList = (req: any, res: any) => {
  const data: any[] = [];
  let i = 0;
  const list1 = ['微信', '支付宝', '中邮钱包', 'NMD'];
  while (i < 200) {
    data.push({
      index: i,
      strategy_name: 'fake' + i,
      touch_way: list1[i % 4],
      num1: i,
      num2: i,
      num3: i,
      num4: i,
      num5: i,
      num6: i,
      num7: i,
    });
    i++;
  }

  res.json({
    code: 200,
    data: {
      column: [
        {
          name: '策略名称',
          value: 'strategy_name',
        },
        {
          name: '触达方式',
          value: 'touch_way',
        },
        {
          name: '收到信息后登陆用户数',
          value: 'count',
        },
        {
          name: '当天',
          value: 'num1',
        },
        {
          name: '3天',
          value: 'num2',
        },
        {
          name: '7天',
          value: 'num3',
        },
        {
          name: '15天',
          value: 'num4',
        },
        {
          name: '30天',
          value: 'num5',
        },
      ],
      data,
    },
  });
};

export default {
  'GET /bgs/analysis/dict/events': getEventList,
  'GET /bgs/analysis/dict/fields': getFieldList,
  'GET /bgs/analysis/table/list': getTableList,
};
