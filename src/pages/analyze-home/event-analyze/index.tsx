import TemplateAnalyze from '../template-analyze';

const BgsEventAnalyze = (props: any) => {
  const moduleType = 'bgs_event';

  return (
    <TemplateAnalyze
      moduleType={moduleType}
      defaultGroupBy={[]}
      defaultSortColumn={[]}
      extraGroupByList={[]}
      extraTips="         (请至少选择策略ID和策略名称中的一个作为筛选/分组条件)"
      needVerifyType="or"
      needVerifyColumn={[
        {
          name: 'strategy_id',
          label: '策略ID',
        },
        {
          name: 'strategy_name',
          label: '策略名称',
        },
      ]}
      {...props}
    />
  );
};

export default BgsEventAnalyze;
