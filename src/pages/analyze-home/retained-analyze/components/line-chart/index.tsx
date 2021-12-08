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
  useEffect(() => {
    console.log(selectData);
  }, [selectData]);

  return (
    <Chart
      height={400}
      data={selectData}
      autoFit
      onAxisLabelClick={console.log}
      padding="auto"
      appendPadding={[10, 10, 10, 10]}
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
  );
};

export default LineChart;
