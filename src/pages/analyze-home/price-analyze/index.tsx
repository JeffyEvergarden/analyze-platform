import TemplateAnalyze from '../template-analyze';
// 因为功能类和新广告分析功能基本一样，只是改了moduleType接口

const PriceAnalyze = (props: any) => {
  const moduleType = 'price_change';
  return <TemplateAnalyze moduleType={moduleType} {...props} />;
};

export default PriceAnalyze;
