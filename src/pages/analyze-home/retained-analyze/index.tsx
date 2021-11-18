import React, { useState, useEffect, useRef } from 'react';
import { useModel } from 'umi';
import { Space, Button, Collapse, Select } from 'antd';
import style from './style.less';
// 业务组件
import StatisticsSearch from '../components/statistics-search';
import FollowUpSearch from './components/followup-search';
import CompareSearch from './components/compare-search';
// import LineChart from './components/line-chart';
import Table from './components/result-table';
// 共有数据源
import { useSearchModel } from '../model';
import { modelTypeList, userTypeList } from './model/const';
// 定制
import { useTableModel } from './model';

const { Panel } = Collapse;
const { Option } = Select;

interface AnalyzePageProps {
  expand?: boolean; // 是否默认展开 折叠
  modelType?: string; // 分析模型类型 01、02、03
}

// 留存分析 -------------

const RetainedAnalyzePage: React.FC<any> = (props: AnalyzePageProps) => {
  const { expand = true, modelType } = props;

  // 是否默认展开 key
  const CollapseKey = expand ? ['1', '2', '3', '4'] : [];

  // 搜索条件---选择分析模型
  const [selectModelType, setSelectModelType] = useState<string>(modelType || '01');
  // 搜索条件---选择用户
  const [selectUserType, setSelectUserType] = useState<string>('01');
  // 搜索条件---筛选框的数据源
  const { eventList, fieldMap, getPreConfig } = useSearchModel();

  const firstSearchRef = useRef(null);

  const lastSearchRef = useRef(null);

  const normalSearchRef = useRef(null);
  // 表格、折线数据
  const { column, tableData, lineData, getTableDataList } = useTableModel();

  // mounted初始化
  useEffect(() => {
    getPreConfig('retained');
    getTableDataList();
  }, []);

  const onClick = () => {
    (firstSearchRef.current as any).getForm();
  };

  return (
    <div className={style['anaylze-page']}>
      {/* 查询条件 */}
      <div className={style['search-box']}>
        <Collapse defaultActiveKey={CollapseKey} ghost>
          {/* 选择分析模型 */}
          <Panel header="选择分析模型" key="1">
            <Space>
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

              <div className={style['zy-row']} style={{ marginLeft: '15px' }}>
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
            </Space>
          </Panel>

          {/* 初始行为 */}
          <Panel header="初始行为" key="2">
            <StatisticsSearch cref={firstSearchRef} list={eventList} map={fieldMap} />
          </Panel>

          {/* 后续行为 */}
          <Panel header="后续行为" key="3">
            <FollowUpSearch cref={normalSearchRef} list={eventList} map={fieldMap} />
          </Panel>

          <Panel header="对比查看" key="4">
            <CompareSearch cref={lastSearchRef} />
          </Panel>
        </Collapse>
      </div>

      {/* 测试功能 */}
      <div className={style['search-box']} style={{ marginTop: '10px' }}>
        <Button onClick={onClick}>fake</Button>
      </div>

      {/* 折线图 */}
      {/* <div className={style['chart-box']} style={{ marginTop: '10px' }}>
        <LineChart />
      </div> */}

      {/* 表格 */}
      <div className={style['table-box']} style={{ marginTop: '10px' }}>
        <Table id={1} column={column} data={tableData} />
      </div>
    </div>
  );
};

export default RetainedAnalyzePage;
