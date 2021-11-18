import React, { useEffect, useImperativeHandle } from 'react';
// 通用组件
import { Table } from 'antd';
import { useState } from 'react';

interface TableProps {
  cref?: any;
  column?: any[];
  data?: any[];
  id?: string;
}

const LineChart: React.FC<any> = (props: TableProps) => {
  const [current, setCurrent] = useState<number>(1);
  const changePage = (val: number) => {
    setCurrent(val);
  };

  const { column, data, id } = props;

  const tableId = `result-table-${id}`;

  return (
    <Table
      id={tableId}
      dataSource={data}
      columns={column}
      pagination={{ current, onChange: changePage }}
    ></Table>
  );
};

export default LineChart;
