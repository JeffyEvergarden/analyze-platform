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
  summary: any;
}

const LineChart: React.FC<any> = (props: TableProps) => {
  const [current, setCurrent] = useState<number>(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const changePage = (val: number) => {
    setCurrent(val);
  };

  const { column = [], data, id, getData, summary, chartList, cref } = props;
  const tableId = `result-table-${id}`;

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
    let data = [summary['total'], summary['proportion']];
    let data2: any = [];
    console.log(data);

    // data?.forEach((res: any, index: any) => {
    //   // console.log(res);
    //   // console.log(chartList);
    //   chartList.forEach((item: any) => {
    //     if (index == 0) {
    //       data2.push({
    //         date: item.title,
    //         type: '总体',
    //         value: res?.[item?.value],
    //       });
    //     } else {
    //       data2.push({
    //         date: item.title,
    //         type: '总体转化',
    //         value: res?.[item?.value],
    //       });
    //     }
    //   });
    // });

    chartList.forEach((item: any) => {
      data2.push({
        date: item.title,
        value: data?.[0]?.[item?.value],
        rate: parseFloat(data?.[1]?.[item?.value]),
      });
    });
    console.log(data2);

    getData(data2);
  }, [summary]);

  const onSelectChange = (item: any, val: any) => {
    if (item?.length > 5) {
      item.length = 5;
      val.length = 5;
      message.info('最多只能勾选5个');
    } else {
      // console.log('selectedRowKeys changed: ', val);
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
    const dataList: any = data;
    //总结下载单独追加
    let population: any = [summary['total'], summary['proportion']].map(
      (item: any, index: number) => {
        item.tableIndex = index == 0 ? '总体' : '总体转化';
        return item;
      },
    );

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

    const outputData = [header, ...outputDataList, ...population];
    console.log(outputData);
    // console.log(header);

    // const tableDOM: HTMLElement | null = document.getElementById(`${tableId}`);
    // const cpTableNode: any = tableDOM?.cloneNode(true);
    // const tempBody: any = cpTableNode?.querySelector('tbody');
    // // const tempTr = cpTableNode?.querySelector('.ant-table-measure-row');
    // // tempBody.removeChild(tempTr);
    // console.log(cpTableNode);

    //数据
    // let ws = XLSX.utils.table_to_sheet(cpTableNode, {
    let ws = XLSX.utils.json_to_sheet(outputData, {
      header: Object.keys(header),
      // raw: true,
      skipHeader: true,
    });
    // console.log(ws);

    //初始化
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, `留存分析${moment().format('YYYYMMDDHHmmss')}.xlsx`);
  };

  useImperativeHandle(cref, () => ({
    exportExcel: () => {
      exportExcel();
    },
  }));

  const summaryHtml = () => {
    // console.log(data);

    // if (!data || data?.length === 0) {
    //   return null;
    // }
    return (
      <Table.Summary fixed>
        <Table.Summary.Row style={{ background: 'rgb(250,250,250' }}>
          {/* <Table.Summary.Cell key={0} index={0}></Table.Summary.Cell> */}
          <Table.Summary.Cell index={1} colSpan={summary?.['mergeNum'] || 1}>
            总体
          </Table.Summary.Cell>
          {column?.map((item: any, index: any) => {
            const key = item.dataIndex;
            if (index >= summary?.['mergeNum']) {
              return (
                <Table.Summary.Cell key={index} index={index}>
                  {formateNumber(summary['total'][key])}
                </Table.Summary.Cell>
              );
            }
          })}
        </Table.Summary.Row>
        <Table.Summary.Row style={{ background: 'rgb(250,250,250' }}>
          {/* <Table.Summary.Cell key={0} index={0}></Table.Summary.Cell> */}
          <Table.Summary.Cell index={1} colSpan={summary?.['mergeNum'] || 1}>
            总体转化
          </Table.Summary.Cell>
          {column?.map((item: any, index: any) => {
            const key = item.dataIndex;
            if (index >= summary?.['mergeNum']) {
              return (
                <Table.Summary.Cell key={index} index={index}>
                  {formateNumber(summary['proportion'][key])}
                </Table.Summary.Cell>
              );
            }
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
      // rowSelection={rowSelection}
      pagination={{ current, onChange: changePage }}
      rowKey={(record) => {
        return `${record.tableIndex}`;
        // return record;
      }}
      scroll={{ x: 200 * (column.length + 2) }}
      summary={summaryHtml}
    ></Table>
  );
};

export default LineChart;
