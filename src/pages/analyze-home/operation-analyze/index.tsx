import TemplateAnalyze from '../template-analyze';
// 因为功能类和新广告分析功能基本一样，只是改了moduleType接口

const OperationAnalyze = (props: any) => {
  const moduleType = 'operation_index';

  // const extraGroupByList = [
  //   {
  //     value: 'advertchannel',
  //     name: '广告投放渠道',
  //   },
  //   {
  //     value: 'event_occur_time',
  //     name: '事件发生日期',
  //   },
  // ];

  return (
    <TemplateAnalyze
      moduleType={moduleType}
      defaultGroupBy={[]}
      defaultSortColumn={[]}
      extraGroupByList={[]}
      timeColumn=""
      showTime={false}
      compareTimeFlag={false}
      // 放款利率、授信利率
      spPercentColumn={['credit_rate', 'loan_rate', 'nvl(store_rate,int_rate)']}
      {...props}
    />
  );
};

export default OperationAnalyze;
