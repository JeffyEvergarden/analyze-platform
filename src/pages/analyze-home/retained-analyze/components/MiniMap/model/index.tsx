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

  // 排序方式 // 列名
  const sorter = (columnName: any) => {
    return (a: any, b: any) => {
      a = a[columnName];
      b = b[columnName];
      let na = Number(a);
      let nb = Number(b);
      if (!isNaN(na) && !isNaN(nb)) {
        return na - nb;
      } else if (!isNaN(na) || !isNaN(nb)) {
        return !isNaN(na) ? 1 : -1;
      } else {
        return a >= b ? 1 : -1;
      }
    };
  };

  const processEvent = (res: any, obj: any, eventList: any, tableColumn: any) => {
    console.log(res, obj, eventList);
    let tableIndex = res?.nextEventTitles?.map((item: any, index: any) => `next_event_num${index}`);
    let step: any = [];
    //步长
    res?.nextEventTitles?.forEach((item: any, index: any) => {
      if (index < res.nextEventTitleNum) {
        // summaryObj[tableIndex[index]] = 0;
        step.push({
          value: tableIndex[index],
          title: item,
          dataIndex: tableIndex[index],
          sortDirection: ['descend', 'ascend'],
          sorter: sorter(tableIndex[index]),
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
          width: 80,
        });
      }
    });
    //将选择的分组过滤出来给表格
    let a = groupByList
      ?.filter((item: any) => {
        return obj?.groupFields?.indexOf(item.value) != -1;
      })
      .map((item) => {
        item.sortDirection = ['descend', 'ascend'];
        item.sorter = sorter(item.value);
        return item;
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
        sortDirection: ['descend', 'ascend'],
        sorter: sorter(`init_event_num${index}`),
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
        width: 100,
      };
    });

    if (tableColumn?.length) {
      tableColumn?.map((item: any) => {
        item.sorter = sorter(item?.tableIndex || item?.value);
      });
      setTableList(tableColumn);
    }

    if (!tableColumn?.length) {
      setTableList([
        { title: '序号', value: 'tableIndex', dataIndex: 'tableIndex', width: 50 },
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
    }
    setChartList(step);

    res?.groupData?.map((item: any, index: any) => {
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
      total: res?.total?.[0] || {},
      proportion: res?.proportion?.[0] || {},
      mergeNum: (obj?.groupFields?.length || 0) + 1,
    });
  };

  const getTable = async (obj: any, eventList: any, tableColumn: any) => {
    setLoading(true);
    let res: any = await getRefreshList(obj);

    if (res.status == 'finished') {
      setLoading(false);
      processEvent(res.data, obj, eventList, tableColumn);
    } else if (res.status == 'failed') {
      setLoading(false);
      message.error('查询失败');
    } else if (res.status == 'running') {
      setTimeout(async () => {
        getTable(obj, eventList, tableColumn);
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
