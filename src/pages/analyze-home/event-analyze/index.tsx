import TemplateAnalyze from '../template-analyze';
import { useRef, useEffect } from 'react';
import { useLocation } from 'umi';
const extraGolabelList: any[] = [
  {
    name: '策略ID',
    value: 'strategy_id',
    type: 'fields',
    dataType: 'input',
    list: [],
  },
];

const BgsEventAnalyze = (props: any) => {
  const moduleType = 'bgs_event';

  const location: any = useLocation();
  const strategyId: any = location?.query?.strategyId;
  const templateRef: any = useRef<any>({});

  useEffect(() => {
    if (strategyId) {
      console.log('策略ID:', strategyId);
      setTimeout(() => {
        (templateRef.current as any).setStaticForm({});
        (templateRef.current as any).setGlobalForm({
          childrenList: [
            {
              subject: 'strategy_id',
              operator: '==',
              params: strategyId,
            },
          ],
        });
      }, 1000);
    }
  }, []);

  return (
    <TemplateAnalyze
      moduleType={moduleType}
      defaultGroupBy={['strategy_name']}
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
      cref={templateRef}
      extraGolabelList={extraGolabelList}
      showTime={false}
      // event_occur_time // 事件发生日期
      unitColumn={'interval_second'} // 窗口期字段
      {...props}
    />
  );
};

export default BgsEventAnalyze;
