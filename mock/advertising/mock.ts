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
  const mertics = ['用户数', '进件笔数'];

  const datas = mertics.map((key: string) => {
    let arr = new Array(10).fill(0);
    arr = arr.map((item: any, index: number) => {
      return {
        activity_id: 'fate',
        activity_name: '命运冠位指定',
        day_id: (20210925 + index).toString(),
        [key]: Number((Math.random() * 1000).toFixed(0)),
      };
    });

    return {
      form_data: {
        metrics: ['order_count', key],
        groupby: ['activity_id', 'activity_name', 'day_id'],
        adhoc_filters: [
          {
            subject: 'event_type',
            comparator: 'fate',
          },
        ],
      },
      data: {
        records: arr,
      },
    };
  });

  res.json({
    resultCode: '000',
    datas: datas,
  });
};

export default {
  'GET /bd/dashboard/analysis/config': getSqlInfo,
  'POST /bd/analysis/explore_active': sendMsg,
  'GET /bd/analysis/explore_activity_result/:id': getList,
};
