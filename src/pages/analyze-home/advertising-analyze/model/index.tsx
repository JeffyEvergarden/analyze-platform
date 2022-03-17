import { message } from 'antd';
import React, { useState, useRef } from 'react';
import {
  fetchMetricsInfo,
  fetchFieldInfo,
  sendMsg,
  getRequsetList,
  fetchSqlBaseInfo,
  getModuleData,
} from './api';
import { OperatorList } from './const';

const sha256 = require('crypto-js/sha256');

function getCurrentData(da: Date) {
  const date = da || new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return `${year}-${month}-${day}`;
}

export const useSearchParamsModel = () => {
  const [eDataFinish, setEDataFinish] = useState<Boolean>(false);
  const [eventData, setEventData] = useState<any[]>([]);
  const [dictList, setDictList] = useState<any[]>([]);

  const queryEvent = async (type: string) => {
    try {
      const params = {
        theme: type,
      };
      setEDataFinish(false);
      const res: any = await fetchMetricsInfo(params);
      console.log(res);

      const list = res || [];
      setEventData([...list]);
      setEDataFinish(true);
    } catch (e) {}
  };
  const queryDict = async () => {
    try {
      const res = await fetchFieldInfo();
      const list = res || [];
      setDictList([...list]);
    } catch (e) {}
  };

  return {
    eDataFinish,
    eventData,
    dictList,
    queryEvent,
    queryDict,
  };
};

export const useFilterModel = () => {
  const [filterList, setFilterList] = useState<any[]>([]);
  const [filterList2, setFilterList2] = useState<any[]>([]);

  const setFilter = (formValues: any, eventDataList: any) => {
    let len = 0;
    let tempObj: any = {}; //用于统计不同指标次数
    let tempArr: Set<any> = new Set(); //存放去重的数组
    let resultArr: any = []; //结果数组
    let compareArr: any = []; //对比并集

    formValues?.map((item: any) => {
      if (item.event && item.fieldsDict instanceof Array) {
        len++;
      }
      item?.fieldsDict?.map((f: any) => {
        tempArr.add(JSON.stringify(f));
        tempObj[f.code] = tempObj[f.code] ? tempObj[f.code] + 1 : 1;
      });
    });
    const setArr: any = Array.from(tempArr).map((item) => JSON.parse(item));
    compareArr = [...setArr];

    resultArr = setArr.filter((item: any) => {
      return tempObj[item.code] === len;
    });

    setFilterList([...resultArr]);
    setFilterList2(compareArr);
  };

  return {
    filterList,
    filterList2,
    setFilter,
  };
};

export const useAdvertiseModel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const fake = useRef<any>({}); //记录id

  //表格数据
  const [activityData, setActivityData] = useState<any[]>([]);
  const [dynamicColumns, setDynamicColumns] = useState<any[]>([]);

  //合计list
  const [summary, setSummary] = useState<any>({});

  const clearData = () => {
    setActivityData([]);
    setDynamicColumns([]);
  };

  const fetchYNFInfo = async (formDataList: any, baseInfo?: any) => {
    const id = sha256(Date.now().toString()).toString().slice(1, 17);
    fake.current.id = id;
    const tempFormDataList: any[] = JSON.parse(JSON.stringify(formDataList));
    const data: any = {
      querySqls: tempFormDataList,
      queryId: id,
    };
    console.log(data);

    return await sendMsg(data, { form_data: { slice_id: baseInfo.sliceId } });
  };

  const processYNFList = (resList: any = [], eventData: any = [], nameMap: any = {}) => {
    try {
      const dynamicTableColumn: any[] = [];
      const objList: any[] = [];
      const map: any = [];
      let groupby: any[] = [];
      resList.map((resData: any, index: any) => {
        if (!resData.data) {
          return;
        }
        const formData = resData.form_data;
        groupby = formData.groupby || [];
        const [, metric] = formData.metrics;
        formData?.groupby.map((item: any) => {
          if (map.indexOf(item) === -1) {
            map.push(item);
            const extra: any = {};
            if (['day_id', 'batch_date'].indexOf(item) > -1) {
              extra.defaultSortOrder = 'descend';
            }
            if (index < 2) {
              extra.fixed = 'left';
            }
            dynamicTableColumn.push({
              ...extra,
              title: [{ label: '' }].find((i: any) => i.key === item)?.label || '',
              dataIndex: item,
              sortDirection: ['descend', 'ascend'],
              sorter: (a: any, b: any) => {
                let ta = a['activity_name'];
                let tb = b['activity_name'];
                if (ta !== tb) {
                  return ta > tb ? 1 : -1;
                }
                a = a[item];
                b = b[item];
                let na = Number(a);
                let nb = Number(b);
                if (!isNaN(na) && !isNaN(nb)) {
                  return na - nb;
                } else if (!isNaN(na) || !isNaN(nb)) {
                  return !isNaN(na) ? 1 : -1;
                } else {
                  return a >= b ? 1 : -1;
                }
              },
              render: (text: any) => {
                if (text instanceof Date) {
                  return getCurrentData(text);
                } else if (typeof text !== 'number') {
                  return text;
                } else {
                  text = text || 0;
                  let str1 = Number(text.toFixed(0));
                  let str2 = Number(text.toFixed(2));
                  let str = Number(str1) === Number(str2) ? str1 : str2;
                  return str;
                }
              },
            });
          }
        });

        //当前的值
        const eventName = formData.adhoc_filters.find(
          (item: any) => item?.subject === 'event_type',
        )?.comparator; //获取key
        //当前项的event_type中文名称
        const eventItem: any = eventData.find((item: any) => item.code === eventName) || {};

        let eventZHnName = eventItem?.name || ''; //以及下拉中文名
        //从eventdata找到code对应的label
        //--------------------------------------------
        //找列名
        let type: string = ''; //二级下拉类型
        let metricsName: string = ''; //二级下拉name
        let eventCode: string = eventItem?.code || ''; //一级下拉key
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
          if (item.code === eventName) {
            eventZHnName = item.name;
            if (type === 'metric') {
              const currentMetrics: any = item.metrics?.find(
                (m: any) => metricsName === m.expression,
              );
              metricsCode = currentMetrics?.expression || metricsName;
              metricsName = currentMetrics?.name || metricsName;
            } else if (type === 'fields') {
              const currentMetrics: any = item.fields?.find((f: any) => metricsName === f.code);
              metricsCode = currentMetrics?.code || metricsName;
              metricsName = currentMetrics?.name || metricsName;
            }
          }
        });

        //从别名映射取 nameMap[titleKey]
        let titleKey = `${index}_${eventCode || ''}_${metricsCode || ''}_${fnCode || ''}`;
        let titleName = index + eventZHnName + metricsName + fnName;
        let titleRealName = eventZHnName + metricsName + fnName;

        //未加入过的新列名
        if (map.indexOf(titleName) === -1) {
          map.push(titleName);
          dynamicTableColumn.push({
            title: nameMap?.[titleKey] || titleRealName,
            dataIndex: titleName,
            sortDirection: ['descend', 'ascend'],
            sorter: (a: any, b: any) => {
              let ta = a['activity_name'];
              let tb = b['activity_name'];
              if (ta !== tb) {
                return ta > tb ? 1 : -1;
              }
              a = a[titleName];
              b = b[titleName];
              let na = Number(a);
              let nb = Number(b);
              if (!isNaN(na) && !isNaN(nb)) {
                return na - nb;
              } else if (!isNaN(na) || !isNaN(nb)) {
                return !isNaN(na) ? 1 : -1;
              } else {
                return a >= b ? 1 : -1;
              }
            },
            render: (text: any) => {
              if (text instanceof Date) {
                return getCurrentData(text);
              } else if (typeof text !== 'number') {
                return text;
              } else {
                text = text || 0;
                let str1 = Number(text.toFixed(0));
                let str2 = Number(text.toFixed(2));
                let str = Number(str1) === Number(str2) ? str1 : str2;
                return str;
              }
            },
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
      let summaryObj: any = {
        activity_name: '合计',
      };
      map.forEach((name: any) => {
        if (groupby.indexOf(name) > -1) {
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

      return objList;
    } catch (e) {
      clearData();
      return [];
    }
  };
  const processList = (resList: any) => {
    if (!Array.isArray(resList)) {
      setLoading(false);
      clearData();
      return;
    }
    const frontActivityList: any[] = processYNFList(
      resList || [],
      fake.current.eventData,
      fake.current.nameMap,
    );
    setActivityData(frontActivityList);
    setLoading(false);
  };
  const startLoop = (time: any) => {
    if (time > 12) {
      setLoading(false);
      message.warning('超时异常');
      return;
    }
    if (!fake.current.id) {
      setLoading(false);
      message.warning('获取不到异步id');
      return;
    }
    fake.current.timeFn = setTimeout(async () => {
      let res: any = await getRequsetList({ id: fake.current.id });
      if (res.resultCode == '000') {
        processList(res?.datas || []);
        clearTimeout(fake.current.timeFn);
      } else if (res.resultCode == '439') {
        startLoop(time + 2);
      } else {
        message.error(res?.resultMsg || '未知系统异常');
        setLoading(false);
      }
    }, time * 1000);
  };
  const getYNFList = async (
    formDataList: any = [],
    eventData: any = [],
    nameMap: any = {},
    baseInfo: any = {},
  ) => {
    fake.current.eventData = eventData;
    fake.current.nameMap = nameMap;
    setLoading(true);
    const data: any = await fetchYNFInfo(formDataList, baseInfo);
    startLoop(3);
  };

  return {
    loading,
    setLoading,
    activityData,
    dynamicColumns,
    summary,
    getYNFList,
    clearData,
  };
};

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

export async function getModuleDetail(id: string) {
  return getModuleData(id);
}
