import React, { useState, useEffect, useRef } from 'react';
import { useModel } from 'umi';
import { Space, Button, Collapse, Row, Col, Select } from 'antd';
import style from './style.less';
// 业务组件
import StatisticsSearch from '../components/statistics-search';
// 数据源
import { modelTypeList, userTypeList } from './model/const';
import { useSearchModel } from '../model';

const { Panel } = Collapse;
const { Option } = Select;

interface AnalyzePageProps {
  expand?: boolean; // 是否默认展开 折叠
  modelType?: string; // 分析模型类型 01、02、03
}

// 留存分析
const RetainedAnalyzePage: React.FC<any> = (props: AnalyzePageProps) => {
  const { expand = true, modelType } = props;

  // 是否默认展开 key
  const CollapseKey = expand ? ['1', '2', '3'] : [];

  // 搜索条件---选择分析模型
  const [selectModelType, setSelectModelType] = useState<string>(modelType || '01');
  // 搜索条件---选择用户
  const [selectUserType, setSelectUserType] = useState<string>('01');
  // 搜索条件---筛选框的数据源
  const { eventList, fieldMap, getPreConfig } = useSearchModel();

  const StatisticsSearchRef = useRef(null);

  // mounted初始化
  useEffect(() => {
    getPreConfig('retained');
  }, []);

  const onClick = () => {
    (StatisticsSearchRef.current as any).getForm();
  };

  return (
    <div className={style['anaylze-page']}>
      <div className={style['search-box']}>
        <Collapse defaultActiveKey={CollapseKey} ghost>
          {/* 选择分析模型 */}
          <Panel header="选择分析模型" key="1">
            <Row justify="start">
              <Col span={8}>
                <div className={style['zy-row']}>
                  <span className="label">选择分析模型：</span>
                  <Select
                    value={selectModelType}
                    style={{ width: '250px' }}
                    placeholder="请选择分析模型"
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
              </Col>

              <Col span={8}>
                <div className={style['zy-row']}>
                  <span className="label">关联主体：</span>
                  <Select
                    value={selectUserType}
                    style={{ width: '250px' }}
                    placeholder="请选择关联主体"
                  >
                    {userTypeList.map((item: any) => {
                      return (
                        <Option value={item.value} key={item.value}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </Col>
            </Row>
          </Panel>

          {/* 初始行为 */}
          <Panel header="初始行为" key="2">
            <StatisticsSearch cref={StatisticsSearchRef} list={eventList} map={fieldMap} />
          </Panel>

          {/* 后续行为 */}
          <Panel header="后续行为" key="3">
            3
          </Panel>
        </Collapse>
      </div>

      <div className={style['search-box']} style={{ marginTop: '10px' }}>
        <Button onClick={onClick}>fake</Button>
      </div>
    </div>
  );
};

export default RetainedAnalyzePage;
