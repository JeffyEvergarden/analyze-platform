export const obj = {
  reqData: {
    defOtherName: '命运指定提现成功人数',
    otherName: '后续别名',
    initEvent: 'fate',
    initMetric: ['用户数'],
    relation: 'AND',
    nextEvent: 'fate',
    nextMetric: '用户数',
    nextCondition: { field: 'select', function: 'equal', params: '测试1', dataType: 'select' },
    groupFields: ['strategy_name'],
    startDate: '2021-12-08',
    endDate: '2021-12-10',
    timeStep: -1,
  },
  formData: {
    first: {
      event: 'fate',
      // attribute: '用户数',
      relation: 'AND',
      // metricsList: [
      //   { name: '用户数', value: '用户数', type: 'metrics' },
      //   { name: '提现成功人数', value: '户均提现成功金额', type: 'metrics' },
      //   { name: '提现成功笔数', value: '提现成功笔数', type: 'metrics' },
      // ],
      // fieldList: [
      //   {
      //     name: '下拉框',
      //     value: 'select',
      //     type: 'fields',
      //     dataType: 'select',
      //     list: [
      //       { name: '测试1', value: '测试1' },
      //       { name: '测试2', value: '测试2' },
      //     ],
      //   },
      //   {
      //     name: '下拉框2',
      //     value: 'select2',
      //     type: 'fields',
      //     dataType: 'select',
      //     list: [
      //       { name: '测试1', value: '测试1' },
      //       { name: '测试2', value: '测试2' },
      //     ],
      //   },
      //   { name: '输入框', value: 'input', type: 'fields', dataType: 'input' },
      //   { name: '时间选择器', value: 'dateTime', type: 'fields', dataType: 'dateTime' },
      //   { name: '数字框', value: 'numbr', type: 'fields', dataType: 'number', list: [] },
      // ],
      // associatedFieldsList: [{ code: 'xx', name: 'xx', value: 'xx' }],
      // EventList: [
      //   {
      //     name: '命运冠位指定',
      //     value: 'LQHTXCG',
      //     metricsList: [
      //       { name: '用户数', value: '用户数', type: 'metrics' },
      //       { name: '提现成功人数', value: '户均提现成功金额', type: 'metrics' },
      //       { name: '提现成功笔数', value: '提现成功笔数', type: 'metrics' },
      //     ],
      //     fieldList: [
      //       {
      //         name: '下拉框',
      //         value: 'select',
      //         type: 'fields',
      //         dataType: 'select',
      //         list: [
      //           { name: '测试1', value: '测试1' },
      //           { name: '测试2', value: '测试2' },
      //         ],
      //       },
      //       {
      //         name: '下拉框2',
      //         value: 'select2',
      //         type: 'fields',
      //         dataType: 'select',
      //         list: [
      //           { name: '测试1', value: '测试1' },
      //           { name: '测试2', value: '测试2' },
      //         ],
      //       },
      //       { name: '输入框', value: 'input', type: 'fields', dataType: 'input' },
      //       { name: '时间选择器', value: 'dateTime', type: 'fields', dataType: 'dateTime' },
      //       { name: '数字框', value: 'numbr', type: 'fields', dataType: 'number', list: [] },
      //     ],
      //     associatedFieldsList: [{ code: 'xx', name: 'xx', value: 'xx' }],
      //   },
      //   {
      //     name: '原神',
      //     value: 'LBQ',
      //     metricsList: [
      //       { name: '用户数', value: '用户数', type: 'metrics' },
      //       { name: '提现成功人数', value: '户均提现成功金额', type: 'metrics' },
      //       { name: '提现成功笔数', value: '提现成功笔数', type: 'metrics' },
      //     ],
      //     fieldList: [
      //       {
      //         name: '下拉框',
      //         value: 'select',
      //         type: 'fields',
      //         dataType: 'select',
      //         list: [
      //           { name: '测试1', value: '测试1' },
      //           { name: '测试2', value: '测试2' },
      //         ],
      //       },
      //       { name: '输入框', value: 'input', type: 'fields', dataType: 'input' },
      //       { name: '时间选择器', value: 'dateTime', type: 'fields', dataType: 'dateTime' },
      //       { name: '数字框', value: 'number', type: 'fields', dataType: 'number', list: [] },
      //     ],
      //     associatedFieldsList: [{ code: 'xx', name: 'xx', value: 'xx' }],
      //   },
      // ],
      // type: 'metrics',
      otherAttr: [
        { attribute: '用户数' },
        { attribute: '户均提现成功金额' },
        { attribute: '进件笔数' },
        { attribute: '提现成功笔数' },
      ],
    },
    last: {
      event: 'LBQ',
      attribute: '用户数',
      defOtherName: '命运指定提现成功人数',
      alias: '后续别名',
      relation: 'AND',
      // innerList: [
      //   {
      //     attr: 'select',
      //     op: 'equal',
      //     value: '测试1',
      //     dataType: 'select',
      //     operatorList: [
      //       { value: 'equal', name: '等于' },
      //       { value: 'notequal', name: '不等于' },
      //       { value: 'contain', name: '包含' },
      //       { value: 'not contain', name: '不包含' },
      //     ],
      //     subList: [
      //       { name: '测试1', value: '测试1' },
      //       { name: '测试2', value: '测试2' },
      //     ],
      //     selectType: 'single',
      //   },
      // ],
      // metricsList: [
      //   { name: '用户数', value: '用户数', type: 'metrics' },
      //   { name: '提现成功人数', value: '户均提现成功金额', type: 'metrics' },
      //   { name: '提现成功笔数', value: '提现成功笔数', type: 'metrics' },
      // ],
      // fieldList: [
      //   {
      //     name: '下拉框',
      //     value: 'select',
      //     type: 'fields',
      //     dataType: 'select',
      //     list: [
      //       { name: '测试1', value: '测试1' },
      //       { name: '测试2', value: '测试2' },
      //     ],
      //   },
      //   {
      //     name: '下拉框2',
      //     value: 'select2',
      //     type: 'fields',
      //     dataType: 'select',
      //     list: [
      //       { name: '测试1', value: '测试1' },
      //       { name: '测试2', value: '测试2' },
      //     ],
      //   },
      //   { name: '输入框', value: 'input', type: 'fields', dataType: 'input' },
      //   { name: '时间选择器', value: 'dateTime', type: 'fields', dataType: 'dateTime' },
      //   { name: '数字框', value: 'number', type: 'fields', dataType: 'number', list: [] },
      // ],
      // EventList: [
      //   {
      //     name: '命运冠位指定',
      //     value: 'LQHTXCG',
      //     metricsList: [
      //       { name: '用户数', value: '用户数', type: 'metrics' },
      //       { name: '提现成功人数', value: '户均提现成功金额', type: 'metrics' },
      //       { name: '提现成功笔数', value: '提现成功笔数', type: 'metrics' },
      //     ],
      //     fieldList: [
      //       {
      //         name: '下拉框',
      //         value: 'select',
      //         type: 'fields',
      //         dataType: 'select',
      //         list: [
      //           { name: '测试1', value: '测试1' },
      //           { name: '测试2', value: '测试2' },
      //         ],
      //       },
      //       {
      //         name: '下拉框2',
      //         value: 'select2',
      //         type: 'fields',
      //         dataType: 'select',
      //         list: [
      //           { name: '测试1', value: '测试1' },
      //           { name: '测试2', value: '测试2' },
      //         ],
      //       },
      //       { name: '输入框', value: 'input', type: 'fields', dataType: 'input' },
      //       { name: '时间选择器', value: 'dateTime', type: 'fields', dataType: 'dateTime' },
      //       { name: '数字框', value: 'number', type: 'fields', dataType: 'number', list: [] },
      //     ],
      //   },
      //   {
      //     name: '原神',
      //     value: 'LBQ',
      //     metricsList: [
      //       { name: '用户数', value: '用户数', type: 'metrics' },
      //       { name: '提现成功人数', value: '户均提现成功金额', type: 'metrics' },
      //       { name: '提现成功笔数', value: '提现成功笔数', type: 'metrics' },
      //     ],
      //     fieldList: [
      //       {
      //         name: '下拉框',
      //         value: 'select',
      //         type: 'fields',
      //         dataType: 'select',
      //         list: [
      //           { name: '测试1', value: '测试1' },
      //           { name: '测试2', value: '测试2' },
      //         ],
      //       },
      //       { name: '输入框', value: 'input', type: 'fields', dataType: 'input' },
      //       { name: '时间选择器', value: 'dateTime', type: 'fields', dataType: 'dateTime' },
      //       { name: '数字框', value: 'number', type: 'fields', dataType: 'number', list: [] },
      //     ],
      //   },
      // ],
      type: 'metrics',
    },
    compare: { groupBy: ['select2'], dateRange: ['2021-12-08', '2021-12-10'] },
  },
  tableColumn: [
    {
      title: '序号',
      value: 'tableIndex',
      dataIndex: 'tableIndex',
      width: 50,
    },
    {
      value: 'select2',
      dataIndex: 'select2',
      title: '下拉框2',
      name: '下拉框2',
      width: 100,
    },
    {
      title: '命运冠位指定的用户数',
      value: 'init_event_num0',
      dataIndex: 'init_event_num0',
      width: 100,
    },
    {
      value: 'next_event_num0',
      title: '当天',
      dataIndex: 'next_event_num0',
      width: 80,
    },
    {
      value: 'next_event_num1',
      title: '3天',
      dataIndex: 'next_event_num1',
      width: 80,
    },
    {
      value: 'next_event_num2',
      title: '7天',
      dataIndex: 'next_event_num2',
      width: 80,
    },
    {
      value: 'next_event_num3',
      title: '15天',
      dataIndex: 'next_event_num3',
      width: 80,
    },
    {
      value: 'next_event_num4',
      title: '30天',
      dataIndex: 'next_event_num4',
      width: 80,
    },
  ],
};
