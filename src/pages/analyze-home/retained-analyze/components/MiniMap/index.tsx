import React, { useEffect, useImperativeHandle } from 'react';
import style from './style.less';
// 通用组件
import { G2, Chart, Geom, Axis, Tooltip, Legend, Util, getTheme, Line, Point } from 'bizcharts';
import { DownloadOutlined, RetweetOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { message, Table, Card, Divider, Tooltip as Tooltips } from 'antd';
import { useListModel } from './model';
import XLSX from 'xlsx';
import moment from 'moment';
// import
// interface LineChartProps {
//   cref?: any;
//   selectData: any;
// }

interface MiniMapProps {
  cref: any;
  dataJson: any;
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

const MiniMap: React.FC<any> = (props: MiniMapProps) => {
  const [current, setCurrent] = useState<number>(1);
  //表格选择的数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  //图表数据
  const [selectData, setSelectData] = useState<any>([]);
  const changePage = (val: number) => {
    setCurrent(val);
  };

  // const { column, data, id, chartList, otherName, refreshList } = props;
  const { dataJson } = props;

  // 表格数据
  const { loading, chartList, tableList, summary, tableDataList, getTable } = useListModel();

  //table数据加工
  useEffect(() => {
    const list: any[] = dataJson.reqData?._eventList || dataJson?.formData?.first?.EventList || [];
    if (dataJson.reqData && dataJson.formData) {
      getTable(dataJson?.reqData, list, dataJson?.tableColumn || []);
    }
  }, [dataJson]);

  // 加工成图表数据
  useEffect(() => {
    let data = [summary['total'], summary['proportion']];
    let data2: any = [];
    console.log(data);

    // data?.forEach((res: any, index: any) => {
    //   // console.log(res);
    //   // console.log(chartList);
    //   chartList.forEach((item: any) => {
    //     data2.push({
    //       date: item.title,
    //       type: index == 0 ? '总体' : '总体转化',
    //       value: res?.[item?.value],
    //     });
    //   });
    // });

    chartList.forEach((item: any) => {
      data2.push({
        date: item.title,
        value: data?.[0]?.[item?.value], //总体
        rate: data?.[1]?.[item?.value], //总体转化
      });
    });

    setSelectData(data2);
  }, [summary]);

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

  const exportExcel = () => {
    const dataList: any = tableDataList;
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
    tableList?.map((item: any) => {
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

  //表格行选择
  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
  };

  const summaryHtml = () => {
    if (!tableDataList || tableDataList?.length === 0) {
      return null;
    }
    return (
      <Table.Summary fixed>
        <Table.Summary.Row style={{ background: 'rgb(250,250,250' }}>
          {/* <Table.Summary.Cell key={0} index={0}></Table.Summary.Cell> */}
          <Table.Summary.Cell index={1} colSpan={summary?.['mergeNum'] || 1}>
            总体
          </Table.Summary.Cell>
          {tableList?.map((item: any, index: any) => {
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
            总转化率
          </Table.Summary.Cell>
          {tableList?.map((item: any, index: any) => {
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

  let chartIns: any = null;
  const colors = ['#6394f9', '#62daaa'];

  return (
    <Card
      title={
        <div className={style['result']}>
          <div>
            <span>结果</span>
            <Divider type="vertical"></Divider>
            <DownloadOutlined
              onClick={() => {
                exportExcel();
              }}
            ></DownloadOutlined>
            {/* <Tooltips placement="top" title={'刷新并重置勾选'}>
              <RetweetOutlined
                onClick={() => {
                  getTable(dataJson.reqData, 'RETAIN_STRATEGY');
                }}
                style={{ marginLeft: '16px' }}
              />
            </Tooltips> */}
          </div>
          <div>{dataJson?.formData?.last?.alias || dataJson?.formData?.last?.defOtherName}</div>
        </div>
      }
      style={{ marginTop: '10px' }}
    >
      <Chart
        height={400}
        data={selectData}
        autoFit
        onAxisLabelClick={console.log}
        padding="auto"
        appendPadding={[10, 10, 10, 10]}
        forceUpdate="true"
        onGetG2Instance={(chart: any) => {
          chartIns = chart;
        }}
        scale={{
          rate: {
            // tickCount: 5,
            // min: 0,
            type: 'linear-strict',
          },
          value: {
            // tickCount: 5,
            // min: 0,
            type: 'linear-strict',
          },
        }}
      >
        {/* <Legend position="bottom" /> */}
        <Legend
          custom={true}
          allowAllCanceled={true}
          items={[
            {
              value: 'value',
              name: '总体',
              marker: {
                symbol: 'circle',
                style: { fill: colors[0], r: 5 },
              },
            },
            {
              value: 'rate',
              name: '总体转化',
              marker: {
                symbol: 'circle',
                style: { fill: colors[1], r: 5 },
              },
            },
          ]}
          onChange={(ev: any) => {
            console.log('ev', ev);
            const item = ev.item;
            const value = item.value;
            const checked = !item.unchecked;
            const geoms = chartIns.geometries;

            for (let i = 0; i < geoms.length; i++) {
              const geom = geoms[i];

              if (geom.getYScale().field === value) {
                if (checked) {
                  geom.show();
                } else {
                  geom.hide();
                }
              }
            }
          }}
        />
        <Tooltip shared={true} showCrosshairs />
        {/* <Tooltip /> */}
        <Axis name="date" />
        <Axis
          name="value"
          label={{
            formatter: (val) => `${val} `,
          }}
        />
        <Axis
          name="rate"
          label={{
            formatter: (val) => `${val}%`,
          }}
        />

        {/* <Geom
        type="point"
        position="date*value"
        size={4}
        shape={'circle'}
        color={'type'}
        // style={{
        //   stroke: '#fff',
        //   lineWidth: 1,
        // }}
      /> */}
        {/* <Geom
        type="point"
        position="date*rate"
        size={4}
        shape={'circle'}
        color={'type'}
        // style={{
        //   stroke: '#fff',
        //   lineWidth: 1,
        // }}
      /> */}
        {/* <Geom type="line" position="date*value" size={2} color={'type'} shape={'circle'} /> */}
        {/* <Geom type="line" position="date*rate" size={2} color={'type'} shape={'circle'} /> */}
        <Line
          position="date*value"
          color={colors[0]}
          size={2}
          tooltip={[
            'date*value',
            (date, value) => {
              return {
                name: '总体',
                value: `${value}`,
                title: date,
              };
            },
          ]}
        />
        <Line
          position="date*rate"
          color={colors[1]}
          size={2}
          tooltip={[
            'date*rate',
            (date, rate) => {
              return {
                name: '总体转化',
                value: `${rate} %`,
                title: date,
              };
            },
          ]}
        />
        <Point position="date*value" color={colors[0]} size={3} shape="circle" tooltip={false} />
        <Point position="date*rate" color={colors[1]} size={3} shape="circle" tooltip={false} />
      </Chart>

      <Table
        id={'result-table'}
        dataSource={tableDataList}
        columns={tableList}
        // rowSelection={rowSelection}
        pagination={{ current, onChange: changePage }}
        rowKey={(record) => {
          return `${record.tableIndex}`;
          // return record;
        }}
        scroll={{ x: 200 * ((tableList?.length || 0) + 2) }}
        summary={summaryHtml}
      ></Table>
    </Card>
  );
};

export default MiniMap;
