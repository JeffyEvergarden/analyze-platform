import { useState } from 'react';
import { getTableList } from './api';

export const useTableModel = () => {
  // 列名
  const [column, setColumn] = useState<any[]>([]);
  // 数据
  const [tableData, setTableData] = useState<any[]>([]);

  // 折线图数据
  const [lineData, setLineData] = useState<any[]>([]);

  const processColumn = (col: any[]) => {
    const newcol: any[] = [];
    col.forEach((item: any, index: number) => {
      newcol.push({
        title: item.name,
        width: 100,
        dataIndex: item.value,
        key: item.value,
        fixed: index < 2 ? 'left' : undefined,
      });
    });

    return newcol;
  };

  // 加载数据
  const getTableDataList = async () => {
    console.log('fuck');
    const res: any = await getTableList();
    console.log(res);
    const { column = [], data = [] } = res.data || {};
    // console.log(column, data);
    const curColumn = processColumn(column);
    setColumn(column);
    setTableData(tableData);
  };

  return {
    column,
    tableData,
    lineData,
    getTableDataList,
  };
};
