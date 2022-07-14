import { message } from 'antd';
import React, { useState } from 'react';
import { getRefreshList } from './api';
import { groupByList } from './const';

export const useListModel = () => {
  const [tableList, setTableList] = useState<any>([]);
  const [chartList, setChartList] = useState<any>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [tableDataList, setTableDataList] = useState<any>();

  const processEvent = (res: any, obj: any, eventList: any) => {
    console.log(res, obj, eventList);
    let tableIndex = res?.nextEventTitles?.map((item: any, index: any) => `next_event_num${index}`);
    let step: any = [];
    //步长
    res.nextEventTitles.forEach((item: any, index: any) => {
      if (index < res.nextEventTitleNum) {
        // summaryObj[tableIndex[index]] = 0;
        step.push({
          value: tableIndex[index],
          title: item,
          dataIndex: tableIndex[index],
          render: (text: any, record: any) => {
            if (typeof text === 'number') {
              let str1 = text.toFixed(0);
              let str2 = text.toFixed(2);
              // let str2 = toFixed2(text);
              let str: any = Number(str1) === Number(str2) ? str1 : str2;
              str = Number(str);
              // summaryObj[tableIndex[index]] += typeof str === 'number' ? str : 0;
              return str;
            }
            return text;
          },
        });
      }
    });
    //将选择的分组过滤出来给表格
    let a = groupByList?.filter((item: any) => {
      return obj?.groupFields?.indexOf(item.value) != -1;
    });

    let init_event_num = eventList?.find((item: any) => {
      return item.value == obj.initEvent;
    });

    //原-初始单指标
    // let init_Metric = init_event_num?.metricsList?.find((item: any) => {
    //   return item.value == obj.initMetric;
    // });

    //初始行为多指标
    let init_Metric = obj?.initMetric?.map((item: any, index: any) => {
      let mName: any = init_event_num?.metricsList?.find((m: any) => {
        return m.value == item;
      }).name;
      let mAlias: any = obj?.firstOtherName?.[index] || '';
      return {
        title: mAlias || `${init_event_num?.name}的${mName}`,
        value: `init_event_num${index}`,
        dataIndex: `init_event_num${index}`,
        render: (text: any, record: any) => {
          if (typeof text === 'number') {
            let str1 = text.toFixed(0);
            let str2 = text.toFixed(2);

            // let str2 = toFixed2(text);
            let str: any = Number(str1) === Number(str2) ? str1 : str2;
            str = Number(str);
            return str;
          }
          return text;
        },
      };
    });

    setTableList([
      { title: '序号', value: 'tableIndex', dataIndex: 'tableIndex' },
      ...a,
      ...init_Metric,
      // {
      //   title: obj?.firstOtherName || `${init_event_num?.name}的${init_Metric?.name}`,
      //   value: 'init_event_num',
      //   dataIndex: 'init_event_num',
      //   render: (text: any, record: any) => {
      //     if (typeof text === 'number') {
      //       let str1 = text.toFixed(0);
      //       let str2 = text.toFixed(2);

      //       // let str2 = toFixed2(text);
      //       let str: any = Number(str1) === Number(str2) ? str1 : str2;
      //       str = Number(str);
      //       return str;
      //     }
      //     return text;
      //   },
      // },
      ...step,
    ]);

    setChartList(step);

    res.groupData.map((item: any, index: any) => {
      Object.keys(item).forEach((res) => {
        if (typeof item[res] === 'number') {
          let str1 = item[res].toFixed(0);
          let str2 = item[res].toFixed(2);
          // let str2 = toFixed2(item[res]);
          let str = Number(str1) === Number(str2) ? str1 : str2;
          str = Number(str);
          item[res] = str;
        }
      });
      item.tableIndex = String(index + 1);
    });
    setTableDataList(res.groupData);
    console.log(obj);

    setSummary({
      total: res?.total?.[0],
      proportion: res?.proportion?.[0],
      mergeNum: (obj?.groupFields?.length || 0) + 1,
    });
  };

  const getTable = async (obj: any, eventList: any) => {
    setLoading(true);
    let res: any = await getRefreshList(obj);

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
    summary,
    tableDataList,
    getTable,
  };
};
