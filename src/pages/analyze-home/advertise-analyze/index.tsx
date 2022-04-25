import TemplateAnalyze from '../template-analyze';
// 因为功能类和新广告分析功能基本一样，只是改了moduleType接口

const AdvertiseAnalyze = (props: any) => {
  const moduleType = 'sub_activity_2';
  return <TemplateAnalyze moduleType={moduleType} defaultGroupBy={['advertchannel']} {...props} />;
};

export default AdvertiseAnalyze;
