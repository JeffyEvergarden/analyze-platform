import { stringTypeList } from '@/pages/analyze-home/advertising-analyze/model/const';
import { Request, Response } from 'express';

const getSqlInfo = (req: any, res: any) => {
  return res.json({
    code: '200000',
    data: {
      dataSource: '1__table',
      sliceId: '1',
    },
    msg: '处理成功',
  });
};

const sendMsg = (req: any, res: any) => {
  res.json({
    resultCode: '000',
  });
};

const getList = (req: any, res: any) => {
  const mertics = ['用户数', '进件笔数', 'A', '人均', '次均', 'D', 'E', 'V', 'H', 'I', 'J'];

  const datas = mertics.map((key: string) => {
    let arr = new Array(10).fill(0);
    let time_field = 'event_occur_time'; // day_id
    arr = arr.map((item: any, index: number) => {
      return {
        activity_id: 'fate',
        activity_name: '命运冠位指定',
        [time_field]: (20210925 + index).toString(),
        [key]: Number((Math.random() * 1000).toFixed(0)),
      };
    });

    return {
      form_data: {
        metrics: [
          'order_count',
          key,
          // {
          //   column: {
          //     column_Name: key,
          //     filterable: true,
          //     optionName: '_col_' + key,
          //   },
          //   aggregate: 'COUNT_DISTINCT',
          //   label: key,
          // },
        ],
        groupby: ['activity_id', 'activity_name', time_field],
        adhoc_filters: [
          {
            subject: 'event_type',
            comparator: 'fate',
          },
        ],
      },
      data: {
        column: [],
        records: arr,
      },
    };
  });
  console.log(datas);

  res.json({
    resultCode: '000',
    datas: [
      {
        form_data: {
          metrics: [
            'order_count',
            {
              column: {
                column_Name: 'select',
                filterable: true,
                optionName: '_col_' + 'select',
              },
              aggregate: 'COUNT_DISTINCT',
              label: 'select',
            },
          ],
          groupby: ['activity_id', 'activity_name'],
          adhoc_filters: [
            {
              subject: 'event_type',
              comparator: 'fate',
            },
          ],
        },
        data: {
          column: ['activity_id', 'activity_name', 'order_count', 'select'],
          records: [
            {
              activity_id: '1',
              activity_name: '1',
              order_count: 22,
              select: '123',
            },
            {
              activity_id: '2',
              activity_name: '2',
              order_count: 22,
              select: '333',
            },
          ],
        },
      },
    ],
  });
};

export default {
  'GET /bd/dashboard/analysis/config': getSqlInfo,
  'POST /bd/analysis/explore_active': sendMsg,
  'GET /bd/analysis/explore_activity_result/:id': getList,
};
