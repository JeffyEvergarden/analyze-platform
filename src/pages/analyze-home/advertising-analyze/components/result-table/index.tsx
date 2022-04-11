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

const ResultTable: React.FC<any> = (props: TableProps) => {
  const [current, setCurrent] = useState<number>(1);
  const [columnsData, setColumnsData] = useState<any[]>([]);
  const [dataSourceList, setDataSourceList] = useState<any[]>([]);
  const changePage = (val: number) => {
    setCurrent(val);
  };

  const { column, data, id, cref, operationType, summary } = props;
  const tableId = `result-table-${id}`;

  const exportExcel = () => {
    const dataList: any = data;
    if (dataList?.length === 0) {
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
        obj[item] = data[item] ? data[item] : data[item] == 0 ? 0 : '-';
      });
      outputDataList.push(obj);
    });

    const outputData = [header, ...outputDataList];
    console.log(outputData);
    console.log(header);

    //数据
    let ws = XLSX.utils.json_to_sheet(outputData, {
      header: Object.keys(header),
      // raw: true,
      skipHeader: true,
    });
    console.log(ws);

    //初始化
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, `广告分析二期${moment().format('YYYYMMDDHHmmss')}.xlsx`);
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
    ></Table>
  );
};

export default ResultTable;
