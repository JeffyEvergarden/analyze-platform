import { Request, Response } from 'express';
import moment from 'moment';

// 事件接口
const getEventList = (req: any, res: any) => {
  res.json([
    {
      id: '1',
      code: 'LQHTXCG',
      name: '命运冠位指定',
      associatedFields: [
        {
          eventCode: 'xx',
          field: 'xx',
          name: 'xx',
        },
      ],
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
      associatedFields: [
        {
          eventCode: 'xx',
          field: 'xx',
          name: 'xx',
        },
      ],
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
  ]);
};

//后续行为
const getBehaviorList = (req: any, res: any) => {
  res.json([
    {
      id: '1',
      code: 'LQHTXCG',
      name: '命运冠位指定',
      associatedFields: [
        {
          eventCode: 'xx',
          field: 'xx',
          name: 'xx',
        },
      ],
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
    {
      id: '2',
      code: 'LBQ',
      name: '原神',
      associatedFields: [
        {
          eventCode: 'xx',
          field: 'xx',
          name: 'xx',
        },
      ],
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
      index: `${i + 1}`,
      strategy_name: 'fake' + i,
      touch_way: list1[i % 4],
      first_event_date: moment().format(
        `${Math.floor(Math.random() * 20) + 2000}-${Math.floor(Math.random() * 12) + 1}-${
          Math.floor(Math.random() * 31) + 1
        }`,
      ),
      count: Math.floor(Math.random() * 100000000),
      num1: Math.floor(Math.random() * 100000000),
      num2: Math.floor(Math.random() * 100000000),
      num3: Math.floor(Math.random() * 100000000),
      num4: Math.floor(Math.random() * 100000000),
      num5: Math.floor(Math.random() * 100000000),
      num6: Math.floor(Math.random() * 100000000),
      num7: Math.floor(Math.random() * 100000000),
    });
    i++;
  }

  res.json({
    code: 200,
    data: {
      column: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
        },
        {
          title: '策略名称',
          dataIndex: 'strategy_name',
          key: 'strategy_name',
        },
        {
          title: '触达方式',
          dataIndex: 'touch_way',
          key: 'touch_way',
        },
        {
          title: '初始事件日期',
          dataIndex: 'first_event_date',
          key: 'first_event_date',
        },
        {
          title: '收到信息后登陆用户数',
          dataIndex: 'count',
          key: 'count',
        },
        {
          title: '当天',
          dataIndex: 'num1',
          key: 'num1',
        },
        {
          title: '3天',
          dataIndex: 'num2',
          key: 'num2',
        },
        {
          title: '7天',
          dataIndex: 'num3',
          key: 'num3',
        },
        {
          title: '15天',
          dataIndex: 'num4',
          key: 'num4',
        },
        {
          title: '30天',
          dataIndex: 'num5',
          key: 'num5',
        },
      ],
      data,
    },
  });
};

const getRefreshList = (req: any, res: any) => {
  res.json({
    queryConditionId: '',
    status: 'finished',
    data: {
      nextEventTitleNum: 5,
      nextEventTitles: ['当天', '3天', '7天', '15天', '30天'],
      groupData: [
        {
          init_event_num: '123',
          next_event_num1: 2,
          next_event_num2: 2,
          next_event_num3: 2,
          next_event_num4: 2,
          next_event_num5: 2,
          strategy_id: 'id',
          strategy_name: 'name',
        },
        {
          init_event_num: '123',
          next_event_num1: 4,
          next_event_num2: 2,
          next_event_num3: 4,
          next_event_num4: 2,
          next_event_num5: 4,
          strategy_id: 'id',
          strategy_name: 'name',
        },
      ],
    },
  });
};

export default {
  'GET /bgs/analysis/retain/events/dict': getEventList,
  'GET /bgs/analysis/retain/behavior/dict': getBehaviorList,
  'GET /bgs/analysis/dict/fields': getFieldList,
  'GET /bgs/analysis/table/list': getTableList,
  'POST /bgs/retain/query': getRefreshList,
};
