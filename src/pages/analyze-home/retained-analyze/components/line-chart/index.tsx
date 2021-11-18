import React, { useEffect, useImperativeHandle } from 'react';
// 通用组件
import { G2, Chart, Geom, Axis, Tooltip, Legend, Util, getTheme } from 'bizcharts';

interface LineChartProps {
  cref?: any;
}

const LineChart: React.FC<any> = (props: LineChartProps) => {
  const data = [
    {
      date: 'Jan',
      type: 'Tokyo',
      value: 7,
    },
    {
      date: 'Jan',
      type: 'London',
      value: 3.9,
    },
    {
      date: 'Feb',
      type: 'Tokyo',
      value: 6.9,
    },
    {
      date: 'Feb',
      type: 'London',
      value: 4.2,
    },
    {
      date: 'Mar',
      type: 'Tokyo',
      value: 9.5,
    },
    {
      date: 'Mar',
      type: 'London',
      value: 5.7,
    },
    {
      date: 'Apr',
      type: 'Tokyo',
      value: 14.5,
    },
    {
      date: 'Apr',
      type: 'London',
      value: 8.5,
    },
    {
      date: 'May',
      type: 'Tokyo',
      value: 18.4,
    },
    {
      date: 'May',
      type: 'London',
      value: 11.9,
    },
    {
      date: 'Jun',
      type: 'Tokyo',
      value: 21.5,
    },
    {
      date: 'Jun',
      type: 'London',
      value: 15.2,
    },
    {
      date: 'Jul',
      type: 'Tokyo',
      value: 25.2,
    },
    {
      date: 'Jul',
      type: 'London',
      value: 17,
    },
    {
      date: 'Aug',
      type: 'Tokyo',
      value: 26.5,
    },
    {
      date: 'Aug',
      type: 'London',
      value: 16.6,
    },
    {
      date: 'Sep',
      type: 'Tokyo',
      value: 23.3,
    },
    {
      date: 'Sep',
      type: 'London',
      value: 14.2,
    },
    {
      date: 'Oct',
      type: 'Tokyo',
      value: 18.3,
    },
    {
      date: 'Oct',
      type: 'London',
      value: 10.3,
    },
    {
      date: 'Nov',
      type: 'Tokyo',
      value: 13.9,
    },
    {
      date: 'Nov',
      type: 'London',
      value: 6.6,
    },
    {
      date: 'Dec',
      type: 'Tokyo',
      value: 9.6,
    },
    {
      date: 'Dec',
      type: 'London',
      value: 4.8,
    },
  ];

  return (
    <Chart height={400} data={data} autoFit onAxisLabelClick={console.log}>
      <Legend />
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
        style={{
          stroke: '#fff',
          lineWidth: 1,
        }}
      />
      <Geom type="line" position="date*value" size={2} color={'type'} shape={'smooth'} />
    </Chart>
  );
};

export default LineChart;
