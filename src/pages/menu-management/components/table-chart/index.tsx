import React, { useEffect, useImperativeHandle } from 'react';
// 通用组件
import { G2, Chart, Geom, Axis, Tooltip, Legend, Util, getTheme, Line, Point } from 'bizcharts';
import { useState } from 'react';
import { message, Table } from 'antd';

// interface LineChartProps {
//   cref?: any;
//   selectData: any;
// }

const TableChart: React.FC<any> = (props: any) => {
  const [current, setCurrent] = useState<number>(1);
  //表格选择的数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  //图表数据
  const [selectData, setSelectData] = useState<any>([]);
  const changePage = (val: number) => {
    setCurrent(val);
  };
  //       表头   表数据     图x轴的数据
  const { column, data, id, chartList } = props;
  const tableId = `result-table-${id}`;

  // 默认勾选5条数据
  useEffect(() => {
    // console.log(column);
    // console.log(data);
    let init = [];
    let init2 = [];
    for (let i = 0; i < 5; i++) {
      init.push(data?.[i]?.tableIndex);
      init2.push(data?.[i]);
    }
    setSelectedRowKeys(init);
    setSelectedRows(init2);
  }, [data]);

  // 加工成图表数据
  useEffect(() => {
    let data2: any = [];
    selectedRows?.forEach((res: any) => {
      chartList.forEach((item: any) => {
        data2.push({
          date: item.title,
          type: String(res?.tableIndex),
          value: res?.[item?.value],
        });
      });
    });
    setSelectData(data2);
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
    <div>
      <Chart
        height={400}
        data={selectData}
        autoFit
        onAxisLabelClick={console.log}
        padding="auto"
        appendPadding={[10, 0, 0, 0]}
        forceUpdate="true"
      >
        <Legend position="right" />
        <Tooltip shared={true} showCrosshairs />
        {/* <Tooltip /> */}
        <Axis name="date" />
        <Axis
          name="value"
          label={{
            formatter: (val) => `${val} `,
          }}
        />
        <Geom
          type="point"
          position="date*value"
          size={4}
          shape={'circle'}
          color={'type'}
          // style={{
          //   stroke: '#fff',
          //   lineWidth: 1,
          // }}
        />
        <Geom type="line" position="date*value" size={2} color={'type'} shape={'circle'} />
      </Chart>
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
    </div>
  );
};

export default TableChart;
