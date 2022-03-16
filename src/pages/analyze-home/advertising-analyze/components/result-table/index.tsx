import React, { useEffect, useImperativeHandle } from 'react';
// 通用组件
import { message, Table } from 'antd';
import { useState } from 'react';
import XLSX from 'xlsx';
import moment from 'moment';
interface TableProps {
  cref?: any;
  column?: any[];
  data?: any[];
  id?: string;
}

const ResultTable: React.FC<any> = (props: TableProps) => {
  const [current, setCurrent] = useState<number>(1);
  const changePage = (val: number) => {
    setCurrent(val);
  };

  const { column, data, id, cref } = props;
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
    // let ws = XLSX.utils.table_to_sheet(cpTableNode, {
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

  return (
    <Table
      id={tableId}
      dataSource={data}
      columns={column}
      pagination={{ current, onChange: changePage }}
      rowKey={(record) => {
        return `${record.tableIndex}`;
        // return record;
      }}
    ></Table>
  );
};

export default ResultTable;
