import React, { useState } from 'react';
import { getEventList, getFieldList, getBehaviorList, getRefreshList } from './api';
import { groupByList } from '../retained-analyze/model/const';

export const useSearchModel = () => {
  const [eventList, setEventList] = useState<any[]>([]);
  const [fieldMap, setFieldMap] = useState<Map<string, any[]>>(new Map());

  // 数据加工
  const processEvent = (originList: any, map: any) => {
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
        if (subItem.dataType === 'dateTime') {
          // 时间选择框
          type = subItem.dataType;
        }
        if (subItem.dataType === 'string' && map.get(subItem.code)) {
          // 时间选择框
          subList = map.get(subItem.code);
          type = 'select';
        }
        if (subItem.dataType === 'numberic') {
          // 时间选择框
          subList = map.get(subItem.code) || [];
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
    setEventList(list);
  };

  // 获取事件列表
  const getEvent = async (theme: any) => {
    let res: any = await getEventList({ theme: theme });

    const list: any[] = Array.isArray(res) ? res : [];
    // setEventList(list);
    return list;
  };

  // 获取映射列表
  const getField = async () => {
    let res: any = await getFieldList();
    const list: any[] = Array.isArray(res) ? res : [];
    const map = new Map();
    list.forEach((item: any, index: number) => {
      let name: string = item.code || '';
      // name / value
      let subList = item.dicts || [];
      if (name && subList && subList.length > 0) {
        map.set(name, subList);
      }
    });
    setFieldMap(map);
    return map;
  };

  const getPreConfig = async (theme: any) => {
    let [list, map] = await Promise.all([getEvent(theme), getField()]);
    if (list.length > 0) {
      processEvent(list, map);
    }
    // console.log(map);
  };

  return {
    eventList,
    fieldMap,
    getPreConfig,
  };
};

export const useBehaviorModel = () => {
  const [behaviorList, setBehaviorList] = useState<any[]>([]);
  const [behaviorFieldMap, setBehaviorFieldMap] = useState<Map<string, any[]>>(new Map());

  // 数据加工
  const processEvent = (originList: any, map: any) => {
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
        if (subItem.dataType === 'dateTime') {
          // 时间选择框
          type = subItem.dataType;
        }
        if (subItem.dataType === 'string' && map.get(subItem.code)) {
          // 时间选择框
          subList = map.get(subItem.code);
          type = 'select';
        }
        if (subItem.dataType === 'numberic') {
          // 时间选择框
          subList = map.get(subItem.code) || [];
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

  // 获取映射列表
  const getField = async () => {
    let res: any = await getFieldList();
    const list: any[] = Array.isArray(res) ? res : [];
    const map = new Map();
    list.forEach((item: any, index: number) => {
      let name: string = item.code || '';
      // name / value
      let subList = item.dicts || [];
      if (name && subList && subList.length > 0) {
        map.set(name, subList);
      }
    });
    setBehaviorFieldMap(map);
    return map;
  };

  const getBehaviorConfig = async (theme: any, initEvent: any) => {
    let [list, map] = await Promise.all([getEvent(theme, initEvent), getField()]);
    if (list.length > 0) {
      processEvent(list, map);
    }
  };

  return {
    behaviorList,
    behaviorFieldMap,
    getBehaviorConfig,
  };
};

export const useListModel = () => {
  const [tableList, setTableList] = useState<any>([]);
  const [chartList, setChartList] = useState<any>([]);
  const [tableDataList, setTableDataList] = useState<any>();
  let tableIndex = [
    'next_event_num1',
    'next_event_num2',
    'next_event_num3',
    'next_event_num4',
    'next_event_num5',
  ];
  const processEvent = (res: any, obj: any, eventList: any) => {
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
      return item.value == obj.subject;
    })?.name;
    console.log(init_event_num);

    setTableList([
      { title: '序号', value: 'tableIndex', dataIndex: 'tableIndex' },
      ...a,
      {
        title: `${init_event_num}的${obj.initEvent}`,
        value: 'init_event_num',
        dataIndex: 'init_event_num',
      },
      ...step,
    ]);

    setChartList(step);

    res.groupData.map((item: any, index: any) => {
      item.tableIndex = index + 1;
    });
    setTableDataList(res.groupData);
  };

  const getTable = async (obj: any, eventList: any) => {
    let res: any = await getRefreshList(obj);
    console.log(res);
    console.log(eventList);

    processEvent(res.data, obj, eventList);
    //groupFields
  };

  return {
    chartList,
    tableList,
    tableDataList,
    getTable,
  };
};
