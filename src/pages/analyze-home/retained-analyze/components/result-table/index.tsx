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
  getData: any;
  resetSelect: any;
  chartList: any;
}

const LineChart: React.FC<any> = (props: TableProps) => {
  const [current, setCurrent] = useState<number>(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const changePage = (val: number) => {
    setCurrent(val);
  };

  const { column, data, id, getData, chartList, cref } = props;
  const tableId = `result-table-${id}`;

  // 默认勾选5条数据
  useEffect(() => {
    // console.log(column);
    // console.log(data);
    let init = [];
    let init2 = [];
    if (data && data?.length < 5) {
      for (let i = 0; i < data?.length; i++) {
        init.push(data?.[i]?.tableIndex);
        init2.push(data?.[i]);
      }
    } else {
      for (let i = 0; i < 5; i++) {
        init.push(data?.[i]?.tableIndex);
        init2.push(data?.[i]);
      }
    }

    setSelectedRowKeys(init);
    setSelectedRows(init2);
  }, [data]);

  // 加工成图表数据
  useEffect(() => {
    let data2: any = [];
    selectedRows?.forEach((res: any) => {
      // console.log(res);
      // console.log(chartList);
      chartList.forEach((item: any) => {
        data2.push({
          date: item.title,
          type: String(res?.tableIndex),
          value: res?.[item?.value],
        });
      });
    });
    getData(data2);
  }, [selectedRows]);

  const onSelectChange = (item: any, val: any) => {
    if (item?.length > 5) {
      item.length = 5;
      val.length = 5;
      message.info('最多只能勾选5个');
    } else {
      console.log('selectedRowKeys changed: ', val);
      setSelectedRowKeys(item);
      setSelectedRows(val);
    }
  };
  //表格行选择
  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
  };

  const exportExcel = () => {
    const tableDOM: HTMLElement | null = document.getElementById(`${tableId}`);
    const cpTableNode: any = tableDOM?.cloneNode(true);
    const tempBody: any = cpTableNode?.querySelector('tbody');
    // const tempTr = cpTableNode?.querySelector('.ant-table-measure-row');
    // tempBody.removeChild(tempTr);

    let ws = XLSX.utils.table_to_sheet(cpTableNode, {
      raw: true,
    });
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, `留存分析${moment().format('YYYYMMDDHHmmss')}.xlsx`);
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
      rowSelection={rowSelection}
      pagination={{ current, onChange: changePage }}
      rowKey={(record) => {
        return `${record.tableIndex}`;
        // return record;
      }}
    ></Table>
  );
};

export default LineChart;
