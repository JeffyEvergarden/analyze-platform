import { message } from 'antd';
import React, { useState } from 'react';
import { getEventList, getFieldList, getBehaviorList, getRefreshList } from './api';
import { groupByList } from './const';

export const useSearchModel = () => {
  const [eventList, setEventList] = useState<any[]>([]);

  // 数据加工
  const processEvent = (originList: any) => {
    console.log(originList);

    const list: any[] = originList.map((item: any, index: number) => {
      // 指标列表
      const metricsList: any[] = item.metrics.map((subItem: any, index: number) => {
        return {
          name: subItem.name,
          value: subItem.expression,
          type: 'metrics',
        };
      });
      // 属性列表
      const fieldList: any[] = [];
      item.fields.forEach((subItem: any, index: number) => {
        // 需过滤 不可分组的数据
        if (subItem.canGroupBy !== '1') {
          return;
        }
        let type: string = 'input'; // 输入框
        let subList: any = undefined; // 下拉框存在 下拉列表

        subItem.dictValues = subItem?.dictValues?.map((item: any) => {
          return { name: item.name, value: item.value };
        });

        if (subItem.dataType === 'dateTime') {
          // 时间选择框
          type = subItem.dataType;
        }
        if (subItem.dataType === 'string' && subItem?.dictValues?.length) {
          // 选择或输入
          subList = subItem.dictValues;
          type = 'select';
        }
        if (subItem.dataType === 'numbric') {
          // 数字
          subList = subItem.dictValues || [];
          type = 'number';
        }
        fieldList.push({
          name: subItem.name,
          value: subItem.code,
          type: 'fields',
          dataType: type,
          list: subList,
        });
      });
      //关联主体
      const associatedFieldsList: any[] = item.associatedFields.map(
        (subItem: any, index: number) => {
          return {
            code: subItem.eventCode,
            name: subItem.name,
            value: subItem.field,
          };
        },
      );
      return {
        name: item.name,
        value: item.code,
        metricsList,
        fieldList,
        associatedFieldsList,
      };
    });
    console.log(list);

    setEventList(list);
  };

  // 获取事件列表
  const getEvent = async (theme: any) => {
    let res: any = await getEventList({ theme: theme });

    const list: any[] = Array.isArray(res) ? res : [];
    // setEventList(list);
    return list;
  };

  const getPreConfig = async (theme: any) => {
    let [list] = await Promise.all([getEvent(theme)]);
    if (list.length > 0) {
      processEvent(list);
    }
    // console.log(map);
  };

  return {
    eventList,
    getPreConfig,
  };
};

export const useBehaviorModel = () => {
  const [behaviorList, setBehaviorList] = useState<any[]>([]);

  // 数据加工
  const processEvent = (originList: any) => {
    const list: any[] = originList.map((item: any, index: number) => {
      // 指标列表
      const metricsList: any[] = item.metrics.map((subItem: any, index: number) => {
        return {
          name: subItem.name,
          value: subItem.expression,
          type: 'metrics',
        };
      });
      // 属性列表
      const fieldList: any[] = [];
      item.fields.forEach((subItem: any, index: number) => {
        // 需过滤 不可分组的数据
        if (subItem.canGroupBy !== '1') {
          return;
        }
        subItem.dictValues = subItem?.dictValues?.map((item: any) => {
          return { name: item.name, value: item.value };
        });
        let type: string = 'input'; // 输入框
        let subList: any = undefined; // 下拉框存在 下拉列表
        if (subItem.dataType === 'dateTime') {
          // 时间选择框
          type = subItem.dataType;
        }
        if (subItem.dataType === 'string' && subItem?.dictValues?.length) {
          // 字符串
          subList = subItem.dictValues;
          type = 'select';
        }
        if (subItem.dataType === 'numbric') {
          // 数字
          subList = subItem.dictValues || [];
          type = 'number';
        }
        fieldList.push({
          name: subItem.name,
          value: subItem.code,
          type: 'fields',
          dataType: type,
          list: subList,
        });
      });
      return {
        name: item.name,
        value: item.code,
        metricsList,
        fieldList,
      };
    });
    setBehaviorList(list);
  };

  // 获取事件列表
  const getEvent = async (theme: any, initEvent: any) => {
    let res: any = await getBehaviorList({ theme: theme, initEvent: initEvent });
    const list: any[] = Array.isArray(res) ? res : [];
    // setEventList(list);
    return list;
  };

  const getBehaviorConfig = async (theme: any, initEvent: any) => {
    let [list] = await Promise.all([getEvent(theme, initEvent)]);
    if (list.length > 0) {
      processEvent(list);
    }
  };

  return {
    behaviorList,
    setBehaviorList,
    getBehaviorConfig,
  };
};

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
          render: (text: any, record: any) => {
            if (typeof text === 'number') {
              let str1 = text.toFixed(0);
              let str2 = text.toFixed(2);
              let str: any = Number(str1) === Number(str2) ? str1 : str2;
              str = Number(str);
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
        render: (text: any, record: any) => {
          if (typeof text === 'number') {
            let str1 = text.toFixed(0);
            let str2 = text.toFixed(2);
            let str: any = Number(str1) === Number(str2) ? str1 : str2;
            str = Number(str);
            return str;
          }
          return text;
        },
      },
      ...step,
    ]);

    setChartList(step);
    console.log(res);

    res.groupData.map((item: any, index: any) => {
      // console.log(item);
      Object.keys(item).forEach((res) => {
        if (typeof item[res] === 'number') {
          let str1 = item[res].toFixed(0);
          let str2 = item[res].toFixed(2);
          let str = Number(str1) === Number(str2) ? str1 : str2;
          item[res] = Number(str);
        }
      });
      item.tableIndex = String(index + 1);
    });
    setTableDataList(res.groupData);
  };

  const getTable = async (obj: any, eventList: any) => {
    setLoading(true);
    let res: any = await getRefreshList(obj);
    // console.log(res);
    console.log(eventList);
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

// export const useTableModel = () => {
//   // 列名
//   const [column, setColumn] = useState<any[]>([]);
//   // 数据
//   const [tableData, setTableData] = useState<any[]>([]);

//   // 折线图数据
//   const [lineData, setLineData] = useState<any[]>([]);

//   const processColumn = (col: any[]) => {
//     const newcol: any[] = [];
//     col.forEach((item: any, index: number) => {
//       newcol.push({
//         title: item.name,
//         width: 100,
//         dataIndex: item.value,
//         key: item.value,
//         fixed: index < 2 ? 'left' : undefined,
//       });
//     });

//     return newcol;
//   };

//   // 加载数据
//   const getTableDataList = async () => {
//     console.log('fuck');
//     const res: any = await getTableList();
//     console.log(res);
//     const { column = [], data = [] } = res.data || {};
//     // console.log(column, data);
//     const curColumn = processColumn(column);
//     setColumn(column);
//     setTableData(data);
//   };

//   return {
//     column,
//     tableData,
//     lineData,
//     getTableDataList,
//   };
// };
