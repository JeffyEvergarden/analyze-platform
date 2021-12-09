// import React, { useEffect, useImperativeHandle } from 'react';
// import style from './style.less';
// // 通用组件
// import { G2, Chart, Geom, Axis, Tooltip, Legend, Util, getTheme, Line, Point } from 'bizcharts';
// import { DownloadOutlined, RetweetOutlined } from '@ant-design/icons';
// import { useState } from 'react';
// import { message, Table, Card, Divider, Tooltip as Tooltips } from 'antd';
// import { useListModel } from './model';

// // interface LineChartProps {
// //   cref?: any;
// //   selectData: any;
// // }

// const miniMap: React.FC<any> = (props: any) => {
//   const [current, setCurrent] = useState<number>(1);
//   //表格选择的数据
//   const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
//   const [selectedRows, setSelectedRows] = useState<any>([]);
//   //图表数据
//   const [selectData, setSelectData] = useState<any>([]);
//   const changePage = (val: number) => {
//     setCurrent(val);
//   };

//   // const { column, data, id, chartList, otherName, refreshList } = props;
//   const { dataJson } = props;

//   // 表格数据
//   const { loading, chartList, tableList, tableDataList, getTable } = useListModel();

//   //table数据加工
//   useEffect(() => {
//     //第二个参数为选择分析模型的值占时只有一个所以写死
//     getTable(dataJson.reqData, 'RETAIN_STRATEGY');
//   }, []);

//   // 默认勾选5条数据
//   useEffect(() => {
//     // console.log(column);
//     // console.log(data);
//     let init = [];
//     let init2 = [];
//     if (tableDataList && tableDataList?.length < 5) {
//       for (let i = 0; i < tableDataList?.length; i++) {
//         init.push(tableDataList?.[i]?.tableIndex);
//         init2.push(tableDataList?.[i]);
//       }
//     } else {
//       for (let i = 0; i < 5; i++) {
//         init.push(tableDataList?.[i]?.tableIndex);
//         init2.push(tableDataList?.[i]);
//       }
//     }

//     setSelectedRowKeys(init);
//     setSelectedRows(init2);
//   }, [tableDataList]);

//   // 加工成图表数据
//   useEffect(() => {
//     let data2: any = [];
//     selectedRows?.forEach((res: any) => {
//       chartList.forEach((item: any) => {
//         data2.push({
//           date: item.title,
//           type: String(res?.tableIndex),
//           value: res?.[item?.value],
//         });
//       });
//     });
//     setSelectData(data2);
//   }, [selectedRows]);

//   const onSelectChange = (item: any, val: any) => {
//     if (item?.length > 5) {
//       item.length = 5;
//       val.length = 5;
//       message.info('最多只能勾选5个');
//     } else {
//       console.log('selectedRowKeys changed: ', val);
//       setSelectedRowKeys(item);
//       setSelectedRows(val);
//     }
//   };
//   //表格行选择
//   const rowSelection = {
//     selectedRowKeys,
//     selectedRows,
//     onChange: onSelectChange,
//   };

//   return (
//     <Card
//       title={
//         <div className={style['result']}>
//           <div>
//             <span>结果</span>
//             <Divider type="vertical"></Divider>
//             <DownloadOutlined onClick={() => {}}></DownloadOutlined>
//             <Tooltips placement="top" title={'刷新并重置勾选'}>
//               <RetweetOutlined
//                 onClick={() => {
//                   getTable(dataJson.reqData, 'RETAIN_STRATEGY');
//                 }}
//                 style={{ marginLeft: '16px' }}
//               />
//             </Tooltips>
//           </div>
//           <div>{dataJson?.formData?.last?.innerList?.[0]?.alias}</div>
//         </div>
//       }
//       style={{ marginTop: '10px' }}
//     >
//       <Chart
//         height={400}
//         data={selectData}
//         autoFit
//         onAxisLabelClick={console.log}
//         padding="auto"
//         appendPadding={[10, 0, 0, 0]}
//         forceUpdate="true"
//       >
//         <Legend position="right" />
//         <Tooltip shared={true} showCrosshairs />
//         {/* <Tooltip /> */}
//         <Axis name="date" />
//         <Axis
//           name="value"
//           label={{
//             formatter: (val) => `${val} `,
//           }}
//         />
//         <Geom
//           type="point"
//           position="date*value"
//           size={4}
//           shape={'circle'}
//           color={'type'}
//           // style={{
//           //   stroke: '#fff',
//           //   lineWidth: 1,
//           // }}
//         />
//         <Geom type="line" position="date*value" size={2} color={'type'} shape={'circle'} />
//       </Chart>
//       <Table
//         // id={tableId}
//         dataSource={tableDataList}
//         columns={tableList}
//         rowSelection={rowSelection}
//         pagination={{ current, onChange: changePage }}
//         rowKey={(record) => {
//           return `${record.tableIndex}`;
//           // return record;
//         }}
//       ></Table>
//     </Card>
//   );
// };

// export default miniMap;
