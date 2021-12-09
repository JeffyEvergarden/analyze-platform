import React, { useState, useEffect, useRef } from 'react';
import { useModel } from 'umi';
import {
  Space,
  Button,
  Collapse,
  Select,
  Card,
  Divider,
  Tooltip,
  Spin,
  ConfigProvider,
} from 'antd';
import { DownloadOutlined, RetweetOutlined } from '@ant-design/icons';
import style from './style.less';
import zhCN from 'antd/lib/locale/zh_CN';
// 业务组件
// import StatisticsSearch from '../components/statistics-search';
import StatisticsSearch from '../components/statistics-search/testIndex';
import FollowUpSearch from './components/followup-search';
import CompareSearch from './components/compare-search';
import LineChart from './components/line-chart';
import Table from './components/result-table';
// 共有数据源
import { useSearchModel, useBehaviorModel, useListModel } from './model';
import { modelTypeList, userTypeList } from './model/const';
import { groupByList } from './model/const';
// 定制
// import { useTableModel } from './model';
import moment from 'moment';
import 'moment/locale/zh-cn';

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
  const { eventList, getPreConfig } = useSearchModel();
  //后续行为
  const { behaviorList, getBehaviorConfig } = useBehaviorModel();
  // 表格数据
  const { loading, chartList, tableList, tableDataList, getTable } = useListModel();

  //检测初始变没
  const [test, setTest] = useState<any>('');

  //别名
  const [otherName, setOtherName] = useState<any>('');

  const firstSearchRef = useRef(null);

  const lastSearchRef = useRef(null);

  const normalSearchRef = useRef(null);
  // 表格、折线数据
  // const { column, tableData, lineData, getTableDataList } = useTableModel();

  //表格选择显示图表
  const [selectedRowDatas, setSelectedRowDatas] = useState<any>([]);

  // mounted初始化
  useEffect(() => {
    getPreConfig('RETAIN_STRATEGY');
    // getTableDataList();
  }, []);

  const refreshList = async () => {
    let statisticsSearch = await (firstSearchRef.current as any).getForm(); //初始行为数据处理为接口需要参数
    let followUpSearch = await (normalSearchRef?.current as any).getForm(); //后续行为数据处理为接口需要参数
    let compareSearch = await (lastSearchRef.current as any).getForm(); //对比查看数据处理为接口需要参数
    // console.log(statisticsSearch);
    // console.log(followUpSearch);
    // console.log(compareSearch);
    let all = Object.assign({}, statisticsSearch, followUpSearch, compareSearch); //合并
    console.log(all);
    if (statisticsSearch && followUpSearch && compareSearch) {
      getTable(all, eventList);
    }
    //别名
    setOtherName(all.otherName);
  };

  const save = async () => {
    //请求所需数据
    let all = await Promise.all([
      (firstSearchRef.current as any).getForm(),
      (normalSearchRef?.current as any).getForm(),
      (lastSearchRef.current as any).getForm(),
    ]);
    //回显所需数据
    let allData = await Promise.all([
      (firstSearchRef.current as any).getFormData(),
      (normalSearchRef?.current as any).getFormData(),
      (lastSearchRef.current as any).getFormData(),
    ]);
    all = Object.assign({}, ...all);
    allData = Object.assign({}, ...allData);
    let save = { reqData: all, formData: allData };
    console.log(save);
  };

  return (
    <ConfigProvider locale={zhCN}>
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
                        <Option value={item.value} key={item.value} disabled={item.disabled}>
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
              <StatisticsSearch
                cref={firstSearchRef}
                list={eventList}
                getBehavior={getBehaviorConfig}
                change={setTest}
              />
            </Panel>

            {/* 后续行为 */}
            <Panel header="后续行为" key="3">
              <FollowUpSearch cref={normalSearchRef} list={behaviorList} change={test} />
            </Panel>

            <Panel header="对比查看" key="4">
              <CompareSearch cref={lastSearchRef} />
            </Panel>
          </Collapse>
        </div>
        <Spin spinning={loading}>
          {/* 测试功能 */}
          <div className={style['select-box']} style={{ marginTop: '10px' }}>
            <Button type="primary" onClick={refreshList}>
              查询
            </Button>
            <Button onClick={save} style={{ marginLeft: '10px' }}>
              保存到看板
            </Button>
          </div>

          <Card
            title={
              <div className={style['result']}>
                <div>
                  <span>结果</span>
                  <Divider type="vertical"></Divider>
                  <DownloadOutlined onClick={() => {}}></DownloadOutlined>
                  <Tooltip placement="top" title={'刷新并重置勾选'}>
                    <RetweetOutlined onClick={refreshList} style={{ marginLeft: '16px' }} />
                  </Tooltip>
                </div>
                <div>{otherName}</div>
              </div>
            }
            style={{ marginTop: '10px' }}
          >
            {/* 折线图 */}
            <div className={style['chart-box']} style={{ marginTop: '10px' }}>
              <span className={style['chart-title']}>留存趋势图</span>
              <LineChart selectData={selectedRowDatas} />
            </div>

            {/* 表格 */}
            <div className={style['table-box']} style={{ marginTop: '10px' }}>
              <Table
                id={1}
                column={tableList}
                data={tableDataList}
                getData={setSelectedRowDatas}
                chartList={chartList}
              />
            </div>
          </Card>
        </Spin>
      </div>
    </ConfigProvider>
  );
};

export default RetainedAnalyzePage;
