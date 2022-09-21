import TemplateAnalyze from '../template-analyze';

const BgsEventAnalyze = (props: any) => {
  const moduleType = 'bgs_event';

  return (
    <TemplateAnalyze
      moduleType={moduleType}
      defaultGroupBy={[]}
      defaultSortColumn={[]}
      extraGroupByList={[]}
      {...props}
    />
  );
};

export default BgsEventAnalyze;
