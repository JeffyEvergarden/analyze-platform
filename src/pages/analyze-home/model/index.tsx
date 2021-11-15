import React, { useState } from 'react';
import { getEventList, getFieldList } from './api';

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
      return {
        name: item.name,
        value: item.code,
        metricsList,
        fieldList,
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
