import { message } from 'antd';
import React, { useState } from 'react';
import { getRefreshList } from './api';
import { groupByList } from './const';

export const useListModel = () => {
  const [tableList, setTableList] = useState<any>([]);
  const [chartList, setChartList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableDataList, setTableDataList] = useState<any>();
  let tableIndex = [
    'next_event_num0',
    'next_event_num1',
    'next_event_num2',
    'next_event_num3',
    'next_event_num4',
  ];
  const processEvent = (res: any, obj: any, eventList: any) => {
    console.log(res);

    console.log(obj);
    console.log(eventList);

    let step: any = [];
    //步长
    res.nextEventTitles.forEach((item: any, index: any) => {
      console.log(item);
      if (index < res.nextEventTitleNum) {
        step.push({
          value: tableIndex[index],
          title: item,
          dataIndex: tableIndex[index],
        });
      }
    });
    //将选择的分组过滤出来给表格
    let a = groupByList?.filter((item: any) => {
      return obj?.groupFields?.indexOf(item.value) != -1;
    });
    console.log(a);
    let init_event_num = eventList?.find((item: any) => {
      return item.value == obj.initEvent;
    });
    let init_Metric = init_event_num?.metricsList?.find((item: any) => {
      return item.value == obj.initMetric;
    });
    console.log(init_event_num);

    setTableList([
      { title: '序号', value: 'tableIndex', dataIndex: 'tableIndex' },
      ...a,
      {
        title: `${init_event_num?.name}的${init_Metric?.name}`,
        value: 'init_event_num',
        dataIndex: 'init_event_num',
      },
      ...step,
    ]);

    setChartList(step);

    res.groupData.map((item: any, index: any) => {
      item.tableIndex = String(index + 1);
    });
    setTableDataList(res.groupData);
  };

  const getTable = async (obj: any, eventList: any) => {
    setLoading(true);
    let res: any = await getRefreshList(obj);
    // console.log(res);
    // console.log(eventList);
    if (res.status == 'finished') {
      setLoading(false);
      processEvent(res.data, obj, eventList);
    } else if (res.status == 'failed') {
      setLoading(false);
      message.error('查询失败');
    } else if (res.status == 'running') {
      setTimeout(async () => {
        getTable(obj, eventList);
      }, 2000);
    }

    //groupFields
  };

  return {
    loading,
    chartList,
    tableList,
    tableDataList,
    getTable,
  };
};
