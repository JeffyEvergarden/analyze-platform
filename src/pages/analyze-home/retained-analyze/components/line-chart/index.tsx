import React, { useEffect, useImperativeHandle } from 'react';
// 通用组件
import { G2, Chart, Geom, Axis, Tooltip, Legend, Util, getTheme, Line, Point } from 'bizcharts';
import { useState } from 'react';

interface LineChartProps {
  cref?: any;
  selectData: any;
}

const LineChart: React.FC<any> = (props: LineChartProps) => {
  const { selectData } = props;
  // useEffect(() => {
  //   console.log(selectData);
  // }, [selectData]);
  let chartIns: any = null;
  const colors = ['#6394f9', '#62daaa'];

  return (
    <Chart
      height={400}
      data={selectData}
      autoFit
      onAxisLabelClick={console.log}
      padding="auto"
      appendPadding={[10, 10, 10, 10]}
      // forceUpdate="true"
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
              value: `${parseFloat(rate)} %`,
              title: date,
            };
          },
        ]}
      />
      <Point position="date*value" color={colors[0]} size={3} shape="circle" tooltip={false} />
      <Point position="date*rate" color={colors[1]} size={3} shape="circle" tooltip={false} />
    </Chart>
  );
};

export default LineChart;
