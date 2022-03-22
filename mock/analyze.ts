import { Request, Response } from 'express';
import moment from 'moment';

// 事件接口
const getEventList = (req: any, res: any) => {
  res.json([
    {
      id: '1',
      code: 'fate',
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
          dictValues: [
            {
              id: '测试1',
              code: '测试1',
              name: '测试1',
              value: '测试1',
            },
            {
              id: '测试2',
              code: '测试2',
              name: '测试2',
              value: '测试2',
            },
          ],
        },
        {
          canGroupBy: '1',
          id: '1',
          code: 'select2',
          name: '下拉框2',
          dataType: 'string',
          dictCode: 'select2',
          dictValues: [
            {
              id: '测试1',
              code: '测试1',
              name: '测试1',
              value: '测试1',
            },
            {
              id: '测试2',
              code: '测试2',
              name: '测试2',
              value: '测试2',
            },
          ],
        },
        {
          canGroupBy: '1',
          id: '2',
          code: 'input',
          name: '输入框',
          dataType: 'string',
          dictCode: undefined,
          dictValues: [],
        },
        {
          canGroupBy: '1',
          id: '3',
          code: 'dateTime',
          name: '时间选择器',
          dataType: 'dateTime',
          dictCode: undefined,
          dictValues: [],
        },
        {
          canGroupBy: '1',
          id: '4',
          code: 'numbr',
          name: '数字框',
          dataType: 'numbric',
          dictCode: undefined,
          dictValues: [],
        },
        {
          canGroupBy: '1',
          id: '5',
          code: 'activity_name',
          name: '活动名称',
          dataType: 'string',
          dictCode: undefined,
          dictValues: [],
        },
        {
          canGroupBy: '1',
          id: '6',
          code: 'activity_id',
          name: '活动ID',
          dataType: 'string',
          dictCode: undefined,
          dictValues: [],
        },
      ],
      metrics: [
        {
          name: '用户数',
          expression: '用户数',
        },
        {
          name: '进件笔数',
          expression: '进件笔数',
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
          dictValues: [
            {
              id: '测试1',
              code: '测试1',
              name: '测试1',
              value: '测试1',
            },
            {
              id: '测试2',
              code: '测试2',
              name: '测试2',
              value: '测试2',
            },
          ],
        },
        {
          canGroupBy: '1',
          id: '2',
          code: 'input',
          name: '输入框',
          dataType: 'string',
          dictCode: undefined,
          dictValues: [],
        },
        {
          canGroupBy: '1',
          id: '3',
          code: 'dateTime',
          name: '时间选择器',
          dataType: 'dateTime',
          dictCode: undefined,
          dictValues: [],
        },
        {
          canGroupBy: '1',
          id: '4',
          code: 'number',
          name: '数字框',
          dataType: 'numbric',
          dictCode: undefined,
          dictValues: [],
        },
      ],
      metrics: [
        {
          name: '用户数',
          expression: '用户数',
        },
        {
          name: '进件笔数',
          expression: '进件笔数',
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
          dictValues: [
            {
              id: '测试1',
              code: '测试1',
              name: '测试1',
              value: '测试1',
            },
            {
              id: '测试2',
              code: '测试2',
              name: '测试2',
              value: '测试2',
            },
          ],
        },
        {
          canGroupBy: '1',
          id: '1',
          code: 'select2',
          name: '下拉框2',
          dataType: 'string',
          dictCode: 'select2',
          dictValues: [
            {
              id: '测试1',
              code: '测试1',
              name: '测试1',
              value: '测试1',
            },
            {
              id: '测试2',
              code: '测试2',
              name: '测试2',
              value: '测试2',
            },
          ],
        },
        {
          canGroupBy: '1',
          id: '2',
          code: 'input',
          name: '输入框',
          dataType: 'string',
          dictCode: undefined,
          dictValues: [],
        },
        {
          canGroupBy: '1',
          id: '3',
          code: 'dateTime',
          name: '时间选择器',
          dataType: 'dateTime',
          dictCode: undefined,
          dictValues: [],
        },
        {
          canGroupBy: '1',
          id: '4',
          code: 'number',
          name: '数字框',
          dataType: 'numbric',
          dictCode: undefined,
          dictValues: [],
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
          dictValues: [
            {
              id: '测试1',
              code: '测试1',
              name: '测试1',
              value: '测试1',
            },
            {
              id: '测试2',
              code: '测试2',
              name: '测试2',
              value: '测试2',
            },
          ],
        },
        {
          canGroupBy: '1',
          id: '2',
          code: 'input',
          name: '输入框',
          dataType: 'string',
          dictCode: undefined,
          dictValues: [],
        },
        {
          canGroupBy: '1',
          id: '3',
          code: 'dateTime',
          name: '时间选择器',
          dataType: 'dateTime',
          dictCode: undefined,
          dictValues: [],
        },
        {
          canGroupBy: '1',
          id: '4',
          code: 'number',
          name: '数字框',
          dataType: 'numbric',
          dictCode: undefined,
          dictValues: [],
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
    // status: 'running',
    data: {
      nextEventTitleNum: 5,
      nextEventTitles: ['当天', '3天', '7天', '15天', '30天'],
      groupData: [
        {
          init_event_num: 132.445,
          next_event_num1: null,
          next_event_num2: 2.888,
          next_event_num3: 2.777,
          next_event_num4: 2,
          next_event_num0: 2,
          strategy_id: 'id',
          strategy_name: 'name',
        },
        {
          init_event_num: '123',
          next_event_num1: 41561.662,
          next_event_num2: 23333.662,
          next_event_num3: 22224.662,
          next_event_num4: 41232.66223,
          next_event_num0: 52114.662699,
          strategy_id: 'id',
          strategy_name: 'name',
        },
        {
          init_event_num: '333',
          next_event_num1: 14,
          next_event_num2: 32,
          next_event_num3: 44,
          next_event_num4: 25,
          next_event_num0: 43,
          strategy_id: 'id',
          strategy_name: 'name',
        },
        {
          init_event_num: '222',
          next_event_num1: 41,
          next_event_num2: 22,
          next_event_num3: 43,
          next_event_num4: 12,
          next_event_num0: 41,
          strategy_id: 'id2',
          strategy_name: 'n3ame',
        },
        {
          init_event_num: '444',
          next_event_num1: 22,
          next_event_num2: 23,
          next_event_num3: 34,
          next_event_num4: 12,
          next_event_num0: 14,
          strategy_id: 'id3',
          strategy_name: 'na2me',
        },
        {
          init_event_num: '1523',
          next_event_num1: 34,
          next_event_num2: 23,
          next_event_num3: 24,
          next_event_num4: 26,
          next_event_num0: 42,
          strategy_id: '6id2',
          strategy_name: 'na25me',
        },
        {
          init_event_num: '1523',
          next_event_num1: 34,
          next_event_num2: 23,
          next_event_num3: 24,
          next_event_num4: 26,
          next_event_num0: 42,
          strategy_id: 'i4d2',
          strategy_name: 'na234me',
        },
        {
          init_event_num: '5523',
          next_event_num1: 34,
          next_event_num2: 23,
          next_event_num3: 24,
          next_event_num4: 26,
          next_event_num0: 42,
          strategy_id: 'i3d2',
          strategy_name: 'na2me3',
        },
        {
          init_event_num: '1553',
          next_event_num1: 34,
          next_event_num2: 23,
          next_event_num3: 24,
          next_event_num4: 26,
          next_event_num0: 42,
          strategy_id: 'id32',
          strategy_name: 'na2m23e',
        },
        {
          init_event_num: '1555',
          next_event_num1: 34,
          next_event_num2: 23,
          next_event_num3: 24,
          next_event_num4: 26,
          next_event_num0: 42,
          strategy_id: 'id22',
          strategy_name: 'na22me',
        },
        {
          init_event_num: '15552',
          next_event_num1: 34,
          next_event_num2: 23,
          next_event_num3: 24,
          next_event_num4: 26,
          next_event_num0: 42,
          strategy_id: 'id12',
          strategy_name: 'na21me',
        },
      ],
    },
  });
};

const getbackshow = (req: any, res: any) => {
  if (req.query.type === 'advertise') {
    res.json({
      resultCode: '000',
      datas: {
        analysisType: '22',
        analysisName: '33',
        analysisData:
          '{"statisticsSearch":{"childrenList":[{"event":"fate","attribute":"用户数","relation":"AND","innerList":[{"subject":"select","operator":"in","params":["test1","test2"]}],"edit":false}]},"globalSearch":{"childrenList":[{"subject":"select","operator":"==","params":"test1"}]},"compareSearch":{"groupBy":["activity_name","prod_code","day_id"],"dateType":"day_id","daterange":["2022-03-01T11:00:25+08:00","2022-04-06T11:00:25+08:00"]},"moduleType":"sub_activity"}',
      },
    });
    return;
  }

  res.json({
    datas: {
      analysisType: '22',
      analysisName: '33',
      analysisData:
        '{"formData":{"first":{"event":"LQHTXCG","attribute":"用户数","relation":"AND","metricsList":[{"name":"用户数","value":"用户数","type":"metrics"},{"name":"提现成功人数","value":"户均提现成功金额","type":"metrics"},{"name":"提现成功笔数","value":"提现成功笔数","type":"metrics"}],"fieldList":[{"name":"下拉框","value":"select","type":"fields","dataType":"select","list":[{"name":"测试1","value":"测试1"},{"name":"测试2","value":"测试2"}]},{"name":"下拉框2","value":"select2","type":"fields","dataType":"select","list":[{"name":"测试1","value":"测试1"},{"name":"测试2","value":"测试2"}]},{"name":"输入框","value":"input","type":"fields","dataType":"input"},{"name":"时间选择器","value":"dateTime","type":"fields","dataType":"dateTime"},{"name":"数字框","value":"numbr","type":"fields","dataType":"number","list":[]}],"associatedFieldsList":[{"code":"xx","name":"xx","value":"xx"}],"EventList":[{"name":"命运冠位指定","value":"LQHTXCG","metricsList":[{"name":"用户数","value":"用户数","type":"metrics"},{"name":"提现成功人数","value":"户均提现成功金额","type":"metrics"},{"name":"提现成功笔数","value":"提现成功笔数","type":"metrics"}],"fieldList":[{"name":"下拉框","value":"select","type":"fields","dataType":"select","list":[{"name":"测试1","value":"测试1"},{"name":"测试2","value":"测试2"}]},{"name":"下拉框2","value":"select2","type":"fields","dataType":"select","list":[{"name":"测试1","value":"测试1"},{"name":"测试2","value":"测试2"}]},{"name":"输入框","value":"input","type":"fields","dataType":"input"},{"name":"时间选择器","value":"dateTime","type":"fields","dataType":"dateTime"},{"name":"数字框","value":"numbr","type":"fields","dataType":"number","list":[]}],"associatedFieldsList":[{"code":"xx","name":"xx","value":"xx"}]},{"name":"原神","value":"LBQ","metricsList":[{"name":"用户数","value":"用户数","type":"metrics"},{"name":"提现成功人数","value":"户均提现成功金额","type":"metrics"},{"name":"提现成功笔数","value":"提现成功笔数","type":"metrics"}],"fieldList":[{"name":"下拉框","value":"select","type":"fields","dataType":"select","list":[{"name":"测试1","value":"测试1"},{"name":"测试2","value":"测试2"}]},{"name":"输入框","value":"input","type":"fields","dataType":"input"},{"name":"时间选择器","value":"dateTime","type":"fields","dataType":"dateTime"},{"name":"数字框","value":"number","type":"fields","dataType":"number","list":[]}],"associatedFieldsList":[{"code":"xx","name":"xx","value":"xx"}]}],"type":"metrics"},"last":{"event":"LQHTXCG","attribute":"用户数","relation":"AND","innerList":[{"attr":"select","op":"equal","value":"测试1","dataType":"select","operatorList":[{"value":"equal","name":"等于"},{"value":"notequal","name":"不等于"},{"value":"contain","name":"包含"},{"value":"not contain","name":"不包含"}],"subList":[{"name":"测试1","value":"测试1"},{"name":"测试2","value":"测试2"}],"selectType":"single"}],"metricsList":[{"name":"用户数","value":"用户数","type":"metrics"},{"name":"提现成功人数","value":"户均提现成功金额","type":"metrics"},{"name":"提现成功笔数","value":"提现成功笔数","type":"metrics"}],"fieldList":[{"name":"下拉框","value":"select","type":"fields","dataType":"select","list":[{"name":"测试1","value":"测试1"},{"name":"测试2","value":"测试2"}]},{"name":"下拉框2","value":"select2","type":"fields","dataType":"select","list":[{"name":"测试1","value":"测试1"},{"name":"测试2","value":"测试2"}]},{"name":"输入框","value":"input","type":"fields","dataType":"input"},{"name":"时间选择器","value":"dateTime","type":"fields","dataType":"dateTime"},{"name":"数字框","value":"number","type":"fields","dataType":"number","list":[]}],"EventList":[{"name":"命运冠位指定","value":"LQHTXCG","metricsList":[{"name":"用户数","value":"用户数","type":"metrics"},{"name":"提现成功人数","value":"户均提现成功金额","type":"metrics"},{"name":"提现成功笔数","value":"提现成功笔数","type":"metrics"}],"fieldList":[{"name":"下拉框","value":"select","type":"fields","dataType":"select","list":[{"name":"测试1","value":"测试1"},{"name":"测试2","value":"测试2"}]},{"name":"下拉框2","value":"select2","type":"fields","dataType":"select","list":[{"name":"测试1","value":"测试1"},{"name":"测试2","value":"测试2"}]},{"name":"输入框","value":"input","type":"fields","dataType":"input"},{"name":"时间选择器","value":"dateTime","type":"fields","dataType":"dateTime"},{"name":"数字框","value":"number","type":"fields","dataType":"number","list":[]}]},{"name":"原神","value":"LBQ","metricsList":[{"name":"用户数","value":"用户数","type":"metrics"},{"name":"提现成功人数","value":"户均提现成功金额","type":"metrics"},{"name":"提现成功笔数","value":"提现成功笔数","type":"metrics"}],"fieldList":[{"name":"下拉框","value":"select","type":"fields","dataType":"select","list":[{"name":"测试1","value":"测试1"},{"name":"测试2","value":"测试2"}]},{"name":"输入框","value":"input","type":"fields","dataType":"input"},{"name":"时间选择器","value":"dateTime","type":"fields","dataType":"dateTime"},{"name":"数字框","value":"number","type":"fields","dataType":"number","list":[]}]}],"type":"metrics","edit":false,"alias":"21"},"compare":{"groupBy":["strategy_name"]}}}',
    },
  });
};

const getPublicDashboardData = (req: any, res: any) => {
  res.json({
    datas: [
      {
        createTime: '2021-06-29 17:34:12',
        dashboards: [
          {
            analysisTemplates: null,
            createTime: '2021-06-29 17:34:12',
            dashboardCreator: 'ujiangjiahao',
            dashboardDir: '123456',
            dashboardId: '502c512',
            dashboardModifier: null,
            dashboardName: 'fake1',
            modifyTime: '2021-06-29 17:34:12',
          },
          {
            analysisTemplates: null,
            createTime: '2021-06-29 17:34:12',
            dashboardCreator: 'ujiangjiahao',
            dashboardDir: '1234562',
            dashboardId: '502c5122',
            dashboardModifier: null,
            dashboardName: 'fake2',
            modifyTime: '2021-06-29 17:34:12',
          },
        ],
        dirCreator: 'ujiangjiahao',
        dirDept: 1137,
        dirId: '1123344566',
        dirModifier: null,
        dirName: '公共-科技发展部',
        dirType: 'public',
        modifyTime: '2021-06-29 17:34:12',
      },
    ],
    resultCode: '000',
    resultMsg: 'success',
  });
};

const getTeamDashboard = (req: any, res: any) => {
  res.json({
    datas: [
      {
        createTime: '2021-06-29 17:34:12',
        dashboards: [
          {
            analysisTemplates: null,
            createTime: '2021-06-29 17:34:12',
            dashboardCreator: 'ujiangjiahao',
            dashboardDir: '12134546',
            dashboardId: '502c2512',
            dashboardModifier: null,
            dashboardName: 'fake1',
            modifyTime: '2021-06-29 17:34:12',
          },
          {
            analysisTemplates: null,
            createTime: '2021-06-29 17:34:12',
            dashboardCreator: 'ujiangjiahao',
            dashboardDir: '122343562',
            dashboardId: '502c52122',
            dashboardModifier: null,
            dashboardName: 'fake2',
            modifyTime: '2021-06-29 17:34:12',
          },
        ],
        dirCreator: 'ujiangjiahao',
        dirDept: 1137,
        dirId: '11233445616',
        dirModifier: null,
        dirName: '科技发展部',
        dirType: 'team',
        modifyTime: '2021-06-29 17:34:12',
      },
    ],
    resultCode: '000',
    resultMsg: 'success',
  });
};

const getPersonalDashboard = (req: any, res: any) => {
  res.json({
    datas: [
      {
        createTime: '2021-06-29 17:34:12',
        dashboards: [
          {
            analysisTemplates: null,
            createTime: '2021-06-29 17:34:12',
            dashboardCreator: 'ujiangjiahao',
            dashboardDir: '123422156',
            dashboardId: '502c533212',
            dashboardModifier: null,
            dashboardName: 'fake',
            modifyTime: '2021-06-29 17:34:12',
          },
          {
            analysisTemplates: null,
            createTime: '2021-06-29 17:34:12',
            dashboardCreator: 'ujiangjiahao',
            dashboardDir: '1234544162',
            dashboardId: '502c52231122',
            dashboardModifier: null,
            dashboardName: 'fake',
            modifyTime: '2021-06-29 17:34:12',
          },
        ],
        dirCreator: 'ujiangjiahao',
        dirDept: 1137,
        dirId: '1123344566777',
        dirModifier: null,
        dirName: '111',
        dirType: 'personal',
        modifyTime: '2021-06-29 17:34:12',
      },
      {
        createTime: null,
        dashboards: [
          {
            analysisTemplates: null,
            createTime: '2021-06-29 17:34:12',
            dashboardCreator: 'ujiangjiahao',
            dashboardDir: '123422156',
            dashboardId: '502c533212',
            dashboardModifier: null,
            dashboardName: 'fake',
            modifyTime: '2021-06-29 17:34:12',
          },
          {
            analysisTemplates: null,
            createTime: '2021-06-29 17:34:12',
            dashboardCreator: 'ujiangjiahao',
            dashboardDir: '1234544162',
            dashboardId: '502c52231122',
            dashboardModifier: null,
            dashboardName: 'fake',
            modifyTime: '2021-06-29 17:34:12',
          },
        ],
        dirCreator: 'ujiangjiahao',
        dirDept: 1137,
        dirId: null,
        dirModifier: null,
        dirName: '收到的分享',
        dirType: 'receive',
        modifyTime: '2021-06-29 17:34:12',
      },
    ],
    resultCode: '000',
    resultMsg: 'success',
  });
};

export default {
  'GET /bd/analysis/retain/events/dict': getEventList,
  'GET /bd/analysis/dict/events': getEventList,
  'GET /bd/analysis/retain/behavior/dict': getBehaviorList,
  'GET /bd/analysis/dict/fields': getFieldList,
  'GET /bd/analysis/table/list': getTableList,
  'GET /bd/dashboard/analysis/detail/:id': getbackshow,
  'GET /bd/dashboard/dir/public/list': getPublicDashboardData,
  'GET /bd/dashboard/dir/team/list': getTeamDashboard,
  'GET /bd/dashboard/dir/personal/list': getPersonalDashboard,
  'POST /bd/retain/query': getRefreshList,
};
