import React, { useEffect, useImperativeHandle } from 'react';
// 通用组件
import { message, Table } from 'antd';
import { useState } from 'react';

interface TableProps {
  cref?: any;
  column?: any[];
  data?: any[];
  id?: string;
  getData: any;
  resetSelect: any;
}

const LineChart: React.FC<any> = (props: TableProps) => {
  const [current, setCurrent] = useState<number>(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const changePage = (val: number) => {
    setCurrent(val);
  };

  const { column, data, id, getData } = props;
  const tableId = `result-table-${id}`;

  // 默认勾选5条数据
  useEffect(() => {
    console.log(data);
    let init = [];
    let init2 = [];
    for (let i = 0; i < 5; i++) {
      init.push(data?.[i]?.strategy_name);
      init2.push(data?.[i]);
    }
    setSelectedRowKeys(init);
    setSelectedRows(init2);
  }, [data]);

  // 加工成图表数据
  useEffect(() => {
    let data2: any = [];
    selectedRows?.forEach((res: any) => {
      data2.push({
        date: '当天',
        type: res?.first_event_date,
        value: res?.num1,
      });
      data2.push({
        date: '3天',
        type: res?.first_event_date,
        value: res?.num2,
      });
      data2.push({
        date: '7天',
        type: res?.first_event_date,
        value: res?.num3,
      });
      data2.push({
        date: '15天',
        type: res?.first_event_date,
        value: res?.num4,
      });
      data2.push({
        date: '30天',
        type: res?.first_event_date,
        value: res?.num5,
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

  return (
    <Table
      id={tableId}
      dataSource={data}
      columns={column}
      rowSelection={rowSelection}
      pagination={{ current, onChange: changePage }}
      rowKey={(record) => {
        return `${record.strategy_name}`;
        // return record;
      }}
    ></Table>
  );
};

export default LineChart;
