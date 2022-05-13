import React, { useEffect, useImperativeHandle, useMemo } from 'react';
// 通用组件
import { message, Table } from 'antd';
import { useState } from 'react';
import XLSX from 'xlsx';
import moment from 'moment';
interface TableProps {
  cref: any;
  column: any[];
  data: any[];
  id?: string;
  operationType?: any;
  summary?: any;
  chineseName: string;
}

//格式化
const ONE_YI = 100000000;
function formateNumber(val: any) {
  if (typeof val === 'number') {
    if (val >= ONE_YI * 10) {
      let str1 = (val / ONE_YI).toFixed(0);
      let str2 = (val / ONE_YI).toFixed(2);
      let str = Number(str1) === Number(str2) ? str1 : str2;
      return str + '亿';
    }
    let str1 = val.toFixed(0);
    let str2 = val.toFixed(2);
    let str = Number(str1) === Number(str2) ? str1 : str2;
    return str;
  }
  return val;
}

const reg = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

// 获取日期
function getCurrentData(da: Date) {
  const date = da || new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return `${year}-${month}-${day}`;
}

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
    return text || '-';
  } else {
    text = text || 0;
    let str1 = Number(text.toFixed(0));
    let str2 = Number(text.toFixed(2));
    let str = Number(str1) === Number(str2) ? str1 : str2;
    return str;
  }
};

const ResultTable: React.FC<any> = (props: TableProps) => {
  const [current, setCurrent] = useState<number>(1);
  const [columnsData, setColumnsData] = useState<any[]>([]);
  const [dataSourceList, setDataSourceList] = useState<any[]>([]);
  const [sortDataList, setSortDataList] = useState<any[]>([]);

  const changePage = (val: number) => {
    setCurrent(val);
  };

  const { column, data, id, cref, operationType, summary, chineseName = '敏捷分析' } = props;
  const tableId = `result-table-${id}`;

  const exportExcel = () => {
    let dataList: any = data;
    if (sortDataList?.length === dataSourceList.length) {
      dataList = sortDataList; //排序的数组
    }
    if (dataList?.length === 0) {
      message.warning('当前表格暂无数据');
      return;
    }
    const header: any = {};
    column?.map((item: any) => {
      header[item.dataIndex] = item?.title;
    });
    const outputDataList: any[] = [];
    dataList?.map((data: any) => {
      let obj: any = {};
      Object.keys(header)?.map((item) => {
        obj[item] = normalRender(data[item]); // 数据处理
      });
      outputDataList.push(obj);
    });
    outputDataList.push(summary);

    const outputData = [header, ...outputDataList];
    // console.log(outputData);
    // console.log(header);

    //数据
    let ws = XLSX.utils.json_to_sheet(outputData, {
      header: Object.keys(header),
      // raw: true,
      skipHeader: true,
    });
    // console.log(ws);

    //初始化
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, `${chineseName}${moment().format('YYYYMMDDHHmmss')}.xlsx`);
  };

  const handleTableChange = (...args: any[]) => {
    // 设置排好序的值
    setSortDataList(args[3].currentDataSource || []);
  };

  useImperativeHandle(cref, () => ({
    exportExcel: () => {
      exportExcel();
    },
  }));

  //设置列数据
  const setActivityTable = () => {
    const columns: any = [];
    console.log(column);

    setColumnsData([...columns, ...column]);
  };

  //设置列数据
  const setActivityDataSource = () => {
    setDataSourceList(data);
  };

  useEffect(() => {
    if (operationType) {
      setActivityTable();
      setActivityDataSource();
    }
  }, [data]);

  useEffect(() => {
    setCurrent(1);
  }, [dataSourceList]);

  const extra = useMemo(() => {
    const obj: any = {};
    let len = columnsData.length;
    if (len > 8) {
      obj.x = len * 120;
    }
    return obj;
  }, [columnsData]);

  const summaryHtml = () => {
    if (dataSourceList.length === 0) {
      return null;
    }
    return (
      <Table.Summary fixed>
        <Table.Summary.Row style={{ background: 'rgb(250,250,250' }}>
          {columnsData.map((item: any, index: any) => {
            const key = item.dataIndex;
            return (
              <Table.Summary.Cell key={index} index={index}>
                {formateNumber(summary[key])}
              </Table.Summary.Cell>
            );
          })}
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <Table
      id={tableId}
      dataSource={data}
      columns={column}
      pagination={{ current, onChange: changePage }}
      rowKey={'index'}
      summary={summaryHtml}
      scroll={extra}
      onChange={handleTableChange}
    ></Table>
  );
};

export default ResultTable;
