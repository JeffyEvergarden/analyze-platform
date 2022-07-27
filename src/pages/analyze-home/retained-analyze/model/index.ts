import { message } from 'antd';
import React, { useState, useRef } from 'react';
import { getEventList, getFieldList, getBehaviorList, getRefreshList } from './api';
import { groupByList } from './const';
import { toFixed2 } from '@/utils/utils';

export const useSearchModel = () => {
  const [eventList, setEventList] = useState<any[]>([]);

  // 数据加工
  const processEvent = (originList: any) => {
    // console.log(originList);

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
    // console.log(list);

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

  const fake = useRef<any>({});

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

  const processEvent = (res: any, obj: any, eventList: any) => {
    const _unionList = fake.current.unionList || [];
    const compareList: any[] = [..._unionList];
    // console.log(res, obj, eventList);
    let tableIndex = res.nextEventTitles.map((item: any, index: any) => `next_event_num${index}`);
    let step: any = [];
    let summaryObj: any = {};
    //步长
    res.nextEventTitles.forEach((item: any, index: any) => {
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
    //groupByList
    let a = compareList
      ?.filter((item: any) => {
        return obj?.groupFields?.indexOf(item.value) != -1;
      })
      .map((item: any) => {
        return {
          value: item.value,
          dataIndex: item.value,
          title: item.name,
          sortDirection: ['descend', 'ascend'],
          sorter: sorter(item.value),
          name: item.name,
          width: 100,
        };
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

    setTableList([
      { title: '序号', value: 'tableIndex', dataIndex: 'tableIndex', width: 50 },
      ...a,
      ...init_Metric,
      ...step,
    ]);

    setChartList(step);

    res?.groupData?.map((item: any, index: any) => {
      Object?.keys(item)?.forEach((res) => {
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
    fake,
  };
};

// 取交集和并集
export const useFilterModel = () => {
  const [filterList, setFilterList] = useState<any[]>([]); // 交集
  const [unionList, setUnionList] = useState<any[]>([]); // 并集
  const [extraList, setExtraList] = useState<any[]>([]);

  const setFilter = (...args: any[]) => {
    let len = args.length;
    let tempObj: any = {}; //用于统计不同指标次数
    let tempMap: any = {};
    let tempArr: Set<any> = new Set(); //存放去重的数组
    let resultArr: any = []; //结果数组
    let compareArr: any = []; //对比并集

    const argslist = args;

    argslist?.map((item: any) => {
      // 获取指标
      const list: any[] = item;
      // ----------
      // ----------
      list.forEach((ele: any) => {
        tempObj[ele.value] = tempObj[ele.value] ? tempObj[ele.value] + 1 : 1;
        if (!tempMap[ele.value]) {
          tempMap[ele.value] = ele;
        }
      });
    });
    const setArr: any = Object.keys(tempMap).map((key) => tempMap[key]);
    const _extraList = extraList.filter((item: any) => {
      // 找出多出的字段增加到
      return !tempMap[item.value];
    });
    compareArr = [..._extraList, ...setArr]; //取并集 且增加扩展字段

    // 过滤出
    resultArr = setArr.filter((item: any) => {
      return tempObj[item.value] === len;
    });
    // 输出个数
    // console.log(setArr, tempObj, len);
    setFilterList([...resultArr]); // 交集
    setUnionList(compareArr); // 并集

    // console.log(resultArr, compareArr);
  };

  return {
    filterList,
    unionList,
    setFilter,
    setExtraList,
  };
};
