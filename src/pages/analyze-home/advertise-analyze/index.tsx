import TemplateAnalyze from '../template-analyze';
// 因为功能类和新广告分析功能基本一样，只是改了moduleType接口

const AdvertiseAnalyze = (props: any) => {
  const moduleType = 'sub_activity_2';

  const extraGroupByList = [
    {
      value: 'advertchannel',
      name: '广告投放渠道',
    },
    {
      value: 'event_occur_time',
      name: '事件发生日期',
    },
  ];

  return (
    <TemplateAnalyze
      moduleType={moduleType}
      defaultGroupBy={['advertchannel']}
      extraGroupByList={extraGroupByList}
      {...props}
    />
  );
};

export default AdvertiseAnalyze;
