import { message } from 'antd';
import React, { useState } from 'react';
import { fetchMetricsInfo, fetchFieldInfo } from './api';

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
  const [activityData, setActivityData] = useState<any[]>([]);
  const [dynamicColumns, setDynamicColumns] = useState<any[]>([]);

  const [symmary, setSymmary] = useState<any>({});

  const fetchYNFInfo = (formDataList: any) => {};
  const process = () => {};

  const getYNFList = async () => {};
  const clearData = () => {};

  return {
    activityData,
    dynamicColumns,
    symmary,
    getYNFList,
    clearData,
  };
};
