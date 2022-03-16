import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useModel, useLocation } from 'umi';
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
  message,
} from 'antd';
import { PlusCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import style from './style.less';
// 业务组件
import StatisticsSearch from './components/statistic-search';
import GlobalSearch from './components/global-search';
import CompareSearch from './components/compare-search';
import Table from './components/result-table';

// 共有数据源
import { modelTypeList } from './model/const';
import { useSearchParamsModel, useFilterModel, useAdvertiseModel } from './model';

const { Panel } = Collapse;
const { Option } = Select;

const AdvertisingAnalyzePage: React.FC<any> = (props: any) => {
  const { expand = true, modelType } = props;
  const location: any = useLocation();
  const CollapseKey = expand ? ['1', '2', '3', '4'] : [];

  const StatisticSearchRef = useRef(null);
  const GlobalSearchRef = useRef(null);
  const CompareSearchRef = useRef(null);
  const tableRef = useRef(null);

  // 搜索条件---选择分析模型
  const [selectModelType, setSelectModelType] = useState<string>(modelType || '01');

  const { eventData, dictList, queryEvent, queryDict } = useSearchParamsModel();
  const { filterList, filterList2, setFilter } = useFilterModel();
  const { activityData, dynamicColumns, symmary, getYNFList, clearData } = useAdvertiseModel();

  const addStatisticBt = (
    <>
      <a
        style={{ marginRight: '16px' }}
        onClick={(e) => {
          e.stopPropagation();
          (StatisticSearchRef.current as any)?.addStatistic();
        }}
      >
        <PlusCircleOutlined style={{ marginRight: '4px' }} />
        添加指标
      </a>
    </>
  );

  const addGlobalBt = (
    <>
      <a
        style={{ marginRight: '16px' }}
        onClick={(e) => {
          e.stopPropagation();
          (GlobalSearchRef.current as any)?.addGlobal();
        }}
      >
        <PlusCircleOutlined style={{ marginRight: '4px' }} />
        添加指标
      </a>
    </>
  );

  // 查询
  const refreshList = async (formEventList: any) => {
    let statisticsSearch = await (StatisticSearchRef.current as any).getForm(); //初始行为数据处理为接口需要参数
    let followUpSearch = await (GlobalSearchRef?.current as any).getForm(); //后续行为数据处理为接口需要参数
    let compareSearch = await (CompareSearchRef.current as any).getForm(); //对比查看数据处理为接口需要参数
    // console.log(statisticsSearch);
    // console.log(followUpSearch);
    // console.log(compareSearch);
    let all = Object.assign({}, statisticsSearch, followUpSearch, compareSearch); //合并
    console.log(all);
    // if (statisticsSearch && followUpSearch && compareSearch) {
    //   console.log(eventList);
    //   if (eventList.length) {
    //     getTable(all, eventList);
    //   } else {
    //     getTable(all, formEventList);
    //   }
    // }
    // //别名
    // setOtherName(all.otherName || all.defOtherName);
  };
  const init = async () => {
    await queryEvent('sub_activity');
  };
  useEffect(() => {
    queryDict();
    init();
  }, []);

  const handleExport = useCallback(() => {
    (tableRef.current as any)?.exportExcel();
  }, []);

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

            {/* 选择统计事件 */}
            <Panel header="选择统计事件" key="2" extra={addStatisticBt}>
              <StatisticsSearch
                cref={StatisticSearchRef}
                dictList={dictList}
                eventDataList={eventData}
                setFilter={setFilter}
              />
            </Panel>

            {/* 全局筛选 */}
            <Panel header="全局筛选" key="3" extra={addGlobalBt}>
              <GlobalSearch cref={GlobalSearchRef} list={filterList} dictList={dictList} />
            </Panel>

            <Panel header="对比查看" key="4">
              <CompareSearch cref={CompareSearchRef} list={filterList2} />
            </Panel>
          </Collapse>
        </div>

        <Spin spinning={false}>
          {/* 测试功能 */}
          <div className={style['select-box']} style={{ marginTop: '10px' }}>
            <Button type="primary" onClick={refreshList}>
              查询
            </Button>
            {/* <Button onClick={save} style={{ marginLeft: '10px' }}>
              保存到看板
            </Button> */}

            {/* <Button onClick={backData} style={{ marginLeft: '10px' }}>
              回显
            </Button> */}
          </div>

          <Card
            title={
              <div className={style['result']}>
                <div>
                  <span>结果</span>
                  <Divider type="vertical"></Divider>
                  <DownloadOutlined onClick={handleExport}></DownloadOutlined>
                </div>
                {/* <div>{otherName}</div> */}
              </div>
            }
            style={{ marginTop: '10px' }}
          >
            <div className={style['table-box']} style={{ marginTop: '10px' }}>
              <Table id={1} column={dynamicColumns} data={activityData} cref={tableRef} />
            </div>
          </Card>
        </Spin>
      </div>
    </ConfigProvider>
  );
};

export default AdvertisingAnalyzePage;
