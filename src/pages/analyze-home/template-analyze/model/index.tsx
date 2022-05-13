import { message } from 'antd';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  fetchMetricsInfo,
  fetchFieldInfo,
  sendMsg,
  getRequsetList,
  fetchSqlBaseInfo,
  getModuleData,
} from './api';
import { OperatorList, TitleList, ExtraList } from './const';

// 加密参数
const sha256 = require('crypto-js/sha256');

const reg = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

// 获取日期
function getCurrentData(da: Date) {
  const date = da || new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return `${year}-${month}-${day}`;
}

// 查询下拉参数
export const useSearchParamsModel = () => {
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
        if (subItem.dataType === 'string' && map.get(subItem.dictCode)) {
          // 时间选择框
          subList = map.get(subItem.dictCode);
          type = 'select';
        }
        if (subItem.dataType === 'numbric') {
          // 时间选择框
          subList = map.get(subItem.dictCode) || [];
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
    let res: any = await fetchMetricsInfo({ theme: theme });

    const list: any[] = Array.isArray(res) ? res : [];
    // setEventList(list);
    return list;
  };

  // 获取映射列表
  const getField = async () => {
    let res: any = await fetchFieldInfo();
    const list: any[] = Array.isArray(res) ? res : [];
    const map = new Map();
    list.forEach((item: any, index: number) => {
      let name: string = item.code || '';
      // name / value
      let subList = item?.dicts || [];
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
  };

  return {
    eventList,
    fieldMap,
    getPreConfig,
  };
};

// -----------------

// 取交集和并集
export const useFilterModel = () => {
  const [filterList, setFilterList] = useState<any[]>([]); // 交集
  const [unionList, setUnionList] = useState<any[]>([]); // 并集
  const [extraList, setExtraList] = useState<any[]>([]);

  const setFilter = (formValues: any, eventDataList: any) => {
    let len = 0;
    let tempObj: any = {}; //用于统计不同指标次数
    let tempMap: any = {};
    let tempArr: Set<any> = new Set(); //存放去重的数组
    let resultArr: any = []; //结果数组
    let compareArr: any = []; //对比并集

    formValues?.map((item: any) => {
      // 获取指标
      const list: any[] =
        eventDataList.find((subItem: any) => {
          return subItem.value === item.event;
        })?.fieldList || [];
      if (item.event) {
        // 表示选了 事件
        len++;
      }
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
      return !tempMap[item.key];
    });
    compareArr = [..._extraList, ...setArr]; //取并集 且增加扩展字段

    // 过滤出
    resultArr = setArr.filter((item: any) => {
      return tempObj[item.value] === len;
    });
    // 输出个数
    console.log(tempObj);
    setFilterList([...resultArr]); // 交集
    setUnionList(compareArr); // 并集

    console.log(resultArr, compareArr);
  };

  return {
    filterList,
    unionList,
    setFilter,
    setExtraList,
  };
};

// ----------------------------
// 数值的常规渲染
const normalRender = (text: any) => {
  // 渲染方式
  if (text instanceof Date) {
    return getCurrentData(text); // 时间
  } else if (typeof text === 'string' && reg.test(text)) {
    let _text: any = text;
    try {
      _text = new Date(text).toLocaleString();
    } catch (e) {}
    return _text;
  } else if (typeof text !== 'number') {
    return text;
  } else {
    text = text || 0;
    let str1 = Number(text.toFixed(0));
    let str2 = Number(text.toFixed(2));
    let str = Number(str1) === Number(str2) ? str1 : str2;
    return str;
  }
};

const numberRender = (text: any) => {
  if (isNaN(text)) {
    return '-';
  } else {
    return normalRender(Number(text));
  }
};

const percentRender = (text: any) => {
  if (isNaN(text)) {
    return '-';
  } else {
    return (Number(text) * 100).toFixed(2) + '%';
  }
};
// ----------------------------

// 获取广告分析数据
export const useAdvertiseModel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const fake = useRef<any>({}); //记录id

  //表格数据
  const [titleList, setTitleList] = useState<any[]>([]); // 列标题列表

  const [normalData, setActivityData] = useState<any[]>([]); // 正常表格数据 副本

  const [dynamicColumns, setDynamicColumns] = useState<any[]>([]); // 正常列 副本

  const [diyColumn, setDiyColumn] = useState<any[]>([]); // 可以去选择的指标

  const [processDiyColumn, setProcessDiyColumn] = useState<any[]>([]); // 已选择的指标

  const [hadProcessedColumn, setHadProcessedColumn] = useState<any[]>([]); // 已加工列名

  const [hadProcessedData, setHadProcessedData] = useState<any[]>([]); // 已加工数据

  const [defaultSortColumn, setDefaultSortColumn] = useState<any>('activity_name');

  //合计list
  const [summary, setSummary] = useState<any>({});

  const clearData = () => {
    setActivityData([]);
    setDynamicColumns([]);
  };

  // 排序方式 // 列名
  const sorter = (columnName: any) => {
    return (a: any, b: any) => {
      if (defaultSortColumn) {
        // 默认排序方式  数字大小 -> 活动名称
        let ta = a[defaultSortColumn];
        let tb = b[defaultSortColumn];
        if (ta !== tb) {
          return ta > tb ? 1 : -1;
        }
      }
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

  // 2.发起查询信号
  const startSendMsg = async (formDataList: any, baseInfo?: any) => {
    const id = sha256(Date.now().toString()).toString().slice(1, 17);
    fake.current.id = id;
    const tempFormDataList: any[] = JSON.parse(JSON.stringify(formDataList));
    const data: any = {
      querySqls: tempFormDataList,
      queryId: id,
    };
    // console.log(data);

    return await sendMsg(data, { form_data: { slice_id: baseInfo.sliceId } });
  };

  // 5.加工表格
  const processResponseList = (resList: any = [], eventData: any = [], nameMap: any = {}) => {
    try {
      const dynamicTableColumn: any[] = [];
      const diyColumnList: any[] = [];
      const objList: any[] = [];
      const map: any = []; // 列名字段
      const titleMap = {}; // 列名中文字段
      let groupby: any[] = [];
      const _titleList = titleList.concat(ExtraList);
      resList.map((resData: any, index: any) => {
        if (!resData.data) {
          return;
        }
        const formData = resData.form_data;
        groupby = formData.groupby || [];
        // 指标名称
        const [, metric] = formData.metrics; //获取第二个元素
        //将groupby部分的表头放入column
        formData?.groupby.map((item: any, i: number) => {
          if (map.indexOf(item) === -1) {
            map.push(item);
            const extra: any = {};
            // 找到世间默认为降序
            if (['event_occur_time'].indexOf(item) > -1) {
              extra.defaultSortOrder = 'descend';
            }
            if (i < 5) {
              extra.fixed = 'left';
            }
            dynamicTableColumn.push({
              ...extra,
              title: _titleList.find((i: any) => i.value === item)?.name || '',
              dataIndex: item,
              sortDirection: ['descend', 'ascend'],
              sorter: sorter(item),
              render: normalRender,
            });
          }
        });

        //当前的值
        const eventName = formData.adhoc_filters.find(
          (item: any) => item?.subject === 'event_type',
        )?.comparator; //获取key
        //当前项的event_type中文名称
        // console.log('eventData');
        // console.log(eventData);
        const eventItem: any = eventData.find((item: any) => item.value === eventName) || {};

        let eventZHnName = eventItem?.name || ''; //一级下拉中文名
        //从eventdata找到code对应的label
        //--------------------------------------------
        //找列名
        let type: string = ''; //二级下拉类型
        let metricsName: string = ''; //二级下拉name
        let eventCode: string = eventItem?.value || ''; //一级下拉key
        let metricsCode: string = ''; //二级下拉key
        let fnName: string | undefined = ''; //二级下拉name
        let fnCode: string = ''; //三级下拉key

        //判断从metric取还是field取
        if (typeof metric === 'string') {
          type = 'metric';
          metricsName = metric;
        } else if (metric.column) {
          //有column是取column取得
          type = 'field';
          metricsName = metric.label;
          fnName = metric.aggregate;
        } else {
          type = 'field';
          metricsName = metric.label;
          //人均单独赋值
          fnName = 'DISTINCT_AVG';
        }
        //临时保存当前的record的名称
        const metricsEnglishName = metricsName;
        //fnName从OperatorList找值先
        const operatorItem: any = OperatorList.find((item: any) => item.value === fnName);

        fnCode = operatorItem?.value || fnName;
        fnName = operatorItem?.name || fnName;

        eventData.map((item: any) => {
          if (item.value === eventName) {
            eventZHnName = item.name;
            if (type === 'metric') {
              const currentMetrics: any = item.metricsList?.find(
                (m: any) => metricsName === m.value,
              );
              console.log(currentMetrics);
              console.log(metricsName);

              metricsCode = currentMetrics?.value || metricsName;
              metricsName = currentMetrics?.name || metricsName;
            } else if (type === 'field') {
              const currentMetrics: any = item.fieldList?.find((f: any) => metricsName === f.value);
              metricsCode = currentMetrics?.value || metricsName;
              metricsName = currentMetrics?.name || metricsName;
            }
          }
        });

        //从别名映射取 nameMap[titleKey]
        let titleKey = `${index}_${eventCode || ''}_${metricsCode || ''}_${fnCode || ''}`;
        let titleName = index + eventZHnName + metricsName + fnName;
        let titleRealName = eventZHnName + metricsName + fnName;
        titleMap[titleName] = titleRealName;
        //未加入过的新列名
        if (map.indexOf(titleName) === -1) {
          map.push(titleName);
          dynamicTableColumn.push({
            title: nameMap?.[titleKey] || titleRealName,
            dataIndex: titleName,
            sortDirection: ['descend', 'ascend'],
            sorter: sorter(titleName),
            render: normalRender,
          });
          diyColumnList.push({
            value: titleName,
            label: nameMap?.[titleKey] || titleRealName,
          });
        }
        resData?.data?.records?.map((r: any, rIndex: any) => {
          const tableObj: any = {};
          //当前的值
          const tempValue = r[metricsEnglishName];
          const idx = objList.findIndex((item) => {
            return groupby.findIndex((cell) => item[cell] !== r[cell]) === -1;
          });
          if (idx !== -1) {
            //如果存在
            objList[idx][titleName] = tempValue; // 设置值
            for (let v in r) {
              //不存在的key设置值
              if (!objList[idx][v]) {
                objList[idx][v] = r[v];
              }
            }
          } else {
            //如果不存在则直接插入
            for (let v in r) {
              //不存在的key设置值
              tableObj[v] = r[v];
            }
            //设置值
            tableObj[titleName] = tempValue;
            objList.push(tableObj);
          }
        });
      });

      //去重 把重复的列过滤
      setDynamicColumns(dynamicTableColumn); //去重
      setDiyColumn(diyColumnList); // diy可选列
      let summaryObj: any = {
        [defaultSortColumn]: '合计',
      };
      map.forEach((name: any) => {
        if (groupby.indexOf(name) > -1) {
          return;
        }
        if (
          (titleMap[name] && titleMap[name].indexOf('人均') > -1) ||
          titleMap[name].indexOf('次均') > -1 ||
          titleMap[name].indexOf('平均') > -1 ||
          titleMap[name].indexOf('率') > -1
        ) {
          summaryObj[name] = '-';
          return;
        }
        summaryObj[name] = 0;
        objList.forEach((obItem: any, index: any) => {
          obItem.index = index;
          if (obItem['batch_date']) {
            obItem['batch_date'] = new Date(obItem['batch_date']);
          }
          summaryObj[name] += typeof obItem[name] === 'number' ? obItem[name] : 0;
        });
      });

      setSummary(summaryObj);
      console.log('汇总数据: -----');
      console.log(objList);
      // console.log('自定义指标: -----');
      // console.log(diyColumnList);

      return objList;
    } catch (e) {
      console.log(e);
      clearData();
      return [];
    }
  };

  // todo
  const processDepByDivColumns = (columns: any[], tableData: any[]) => {
    const newColumns: any[] = [...columns]; // 新列

    // 自定义 ------
    processDiyColumn.forEach((item: any, index: number) => {
      let render: any = numberRender;
      if (item.condition === '÷') {
        render = percentRender;
      }

      newColumns.push({
        title: item.alias,
        dataIndex: '_diy_' + index,
        sortDirection: ['descend', 'ascend'],
        sorter: sorter('_diy_' + index),
        render: render,
        width: 150,
      });
    });

    // 新数据 ------
    const newData: any[] = tableData.map((item: any, i: number) => {
      let obj: any = {};
      processDiyColumn.forEach((_column: any, index: number) => {
        let val1: any = item[_column.compare1];
        let val2: any = item[_column.compare2];
        let condition = _column.condition;
        if (!isNaN(val1) && !isNaN(val2)) {
          if (condition === '+') {
            obj['_diy_' + index] = Number(val1) + Number(val2);
          } else if (condition === '-') {
            obj['_diy_' + index] = Number(val1) - Number(val2);
          } else if (condition === '÷') {
            obj['_diy_' + index] = Number(val2) === 0 ? undefined : Number(val1) / Number(val2);
          } else if (condition === 'x') {
            obj['_diy_' + index] = Number(val1) * Number(val2);
          }
        }
      });
      return {
        ...item,
        ...obj,
      };
    });

    return [newColumns, newData];
    // -------
  };

  // 4.加工表格 (做基本判空处理)
  const processList = (resList: any) => {
    if (!Array.isArray(resList)) {
      setLoading(false);
      clearData();
      message.warning('暂无数据');
      return;
    }
    const frontActivityList: any[] = processResponseList(
      resList || [],
      fake.current.eventData,
      fake.current.nameMap, // 别名
    );
    setActivityData(frontActivityList);
    setLoading(false);
  };

  // 3.开始轮询
  const startLoop = (time: any) => {
    if (time > 20) {
      // 当这次查询时长超过20s取消
      setLoading(false);
      message.warning('查询超时异常');
      return;
    }
    if (!fake.current.id) {
      // huo
      setLoading(false);
      message.warning('获取不到异步请求信号id');
      return;
    }
    fake.current.timeFn = setTimeout(async () => {
      let res: any = await getRequsetList({ id: fake.current.id });
      if (res.resultCode == '000') {
        processList(res?.datas || []); // 触发回调加工
        clearTimeout(fake.current.timeFn);
      } else if (res.resultCode == '439') {
        // 439 待机回调中
        startLoop(time + 2);
      } else {
        message.error(res?.resultMsg || '未知系统异常');
        setLoading(false);
      }
    }, time * 1000);
  };

  // 1.主方法
  // 调用 查询信号接口
  // 发起 回调轮询
  const getDataList = async (
    formDataList: any = [],
    eventData: any = [],
    nameMap: any = {},
    baseInfo: any = {},
  ) => {
    fake.current.eventData = eventData;
    fake.current.nameMap = nameMap;
    setLoading(true);
    const res: any = await startSendMsg(formDataList, baseInfo);
    if (res?.resultCode === '000') {
      startLoop(3);
    } else {
      message.warning(res?.resultMsg || '网络异常');
    }
  };

  useEffect(() => {
    const [columns, datas] = processDepByDivColumns(dynamicColumns, normalData);
    setHadProcessedColumn(columns);
    setHadProcessedData(datas);
  }, [processDiyColumn, dynamicColumns, normalData]);

  return {
    loading,
    setLoading,
    normalData,
    dynamicColumns,
    diyColumn,
    summary,
    titleList,
    getDataList,
    clearData,
    processDiyColumn, // 自定义指标
    setProcessDiyColumn,
    setTitleList, // 列名列表
    hadProcessedColumn,
    hadProcessedData,
    setDefaultSortColumn,
  };
};

// 获取基础信息 dataSource 和 sliceId
export const useBaseModel = () => {
  const [baseInfo, setBaseInfo] = useState<any>({});
  const getSqlBaseInfo = async (params: any) => {
    let res = await fetchSqlBaseInfo({
      templateType: 'event',
      ...params,
    });
    if (res.code === '200000') {
      setBaseInfo(res.data || {});
      return res.data;
    } else {
      message.warning('获取配置异常');
      return {};
    }
  };
  return {
    baseInfo,
    getSqlBaseInfo,
  };
};

// 获取详情, 回显示数据
export async function getModuleDetail(id: string, type?: any) {
  return getModuleData(id, type);
}
