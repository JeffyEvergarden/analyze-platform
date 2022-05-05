import { useState } from 'react';
import { Select } from 'antd';
import { useModel, useLocation, history } from 'umi';
import TemplateAnalyze from '../template-analyze';
import style from './style.less';
// 因为功能类和新广告分析功能基本一样，只是改了moduleType接口

const modelTypeList = [
  {
    value: 'price_change',
    name: '调价分析',
  },
  {
    value: 'adj_limit',
    name: '调额分析',
  },
];

const { Option } = Select;

const PriceAnalyze = (props: any) => {
  const query: any = history.location.query;

  const [moduleType, setModuleType] = useState<any>(query?.type || 'price_change');

  const onChange = (val: any) => {
    setModuleType(val);
  };

  return (
    <div>
      <div className={style['select-box']}>
        <div className={style['zy-row']}>
          <span className="label">选择分析模型：</span>
          <Select
            value={moduleType}
            style={{ width: '250px' }}
            placeholder="请选择分析模型"
            onChange={onChange}
          >
            {modelTypeList.map((item: any) => {
              return (
                <Option value={item.value} key={item.value}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>

      <TemplateAnalyze moduleType={moduleType} {...props} key={moduleType} />
    </div>
  );
};

export default PriceAnalyze;
