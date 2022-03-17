import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useModel, useLocation, history } from 'umi';
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
import { PlusCircleOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import style from './style.less';
// 业务组件
import StatisticsSearch from './components/statistic-search';
import GlobalSearch from './components/global-search';
import CompareSearch from './components/compare-search';
import Table from './components/result-table';
import EditModal from '../SaveModel/modal';
import Condition from './components/common/Condition';

// 共有数据源
import { modelTypeList } from './model/const';
import { useSearchParamsModel, useFilterModel, useAdvertiseModel, useBaseModel } from './model';

import { SubAtTransFormDataToSupersetRequestData } from '@/utils/utils';
import { getModuleDetail } from './model';
import { updateModuleData } from './model/api';
import { saveAnalysisModule } from '../retained-analyze/model/api';

const { Panel } = Collapse;
const { Option } = Select;

const AdvertisingAnalyzePage: React.FC<any> = (props: any) => {
  const { type = 'create', id, dirId } = props;

  const show = !(type == 'read');
  const query: any = history.location.query || {};
  const CollapseKey = ['1', '2', '3', '4'];

  const StatisticSearchRef = useRef(null);
  const GlobalSearchRef = useRef(null);
  const CompareSearchRef = useRef(null);
  const tableRef = useRef(null);

  // 搜索条件---选择分析模型
  const [selectModelType, setSelectModelType] = useState<string>('01');

  const { eventData, dictList, queryEvent, queryDict } = useSearchParamsModel();
  const { baseInfo, getSqlBaseInfo } = useBaseModel();
  const { filterList, filterList2, setFilter } = useFilterModel();
  const { loading, setLoading, activityData, dynamicColumns, summary, getYNFList, clearData } =
    useAdvertiseModel();

  const [moduleData, setModuleData] = useState<any>({});
  const [moduleId, setModuleId] = useState<any>(id || query.moduleId || '');
  const [moduleName, setModuleName] = useState<any>('');
  const [moduleType, setModuleType] = useState<any>('sub_activity');
  const [treeSelectId, setTreeSelectId] = useState<any>(dirId || query.dashboardId || '');
  //记录看板Id
  const [dashboardId, setDashboardId] = useState<any>(dirId || query.dashboardId || '');

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

  // 刷新数据
  const refreshList = async () => {
    try {
      const [statisticsSearch, globalSearch, compareSearch] = await Promise.all([
        (StatisticSearchRef.current as any).getForm(),
        (GlobalSearchRef?.current as any).getForm(),
        (CompareSearchRef.current as any).getForm(),
      ]);
      let flag = Object.keys(baseInfo).length > 0;
      if (!flag) {
        message.warning('获取不到数据库信息');
        return null;
      }

      //汇总
      const map: any = {}; // 别名map 对象 key=>alisa
      if (!statisticsSearch.childrenList) {
        return null;
      } else {
        //生成别名映射
        statisticsSearch.childrenList.forEach((item: any, index: any) => {
          if (item.alias) {
            item.index = index;
            const name = `${item.event || ''}_${item.attribute || ''}_${item.fnName || ''}`;
            let i = 0;
            map[index + '_' + name] = item.alias;
          }
        });
      }
      if (statisticsSearch.childrenList.length === 0) {
        message.warning('请至少添加一个选择统计事件');
        return null;
      }
      if (globalSearch.childrenList.length === 0) {
        message.warning('请至少添加一个全局筛选事件');
        return null;
      }
      const formDataList = SubAtTransFormDataToSupersetRequestData(
        {
          statisticData: statisticsSearch,
          globalData: globalSearch,
          compareData: compareSearch,
        },
        baseInfo,
      );

      getYNFList(formDataList, eventData, map, baseInfo);
    } catch (e) {
      message.error('查询错误');
      setLoading(false);
    }

    // //别名
    // setOtherName(all.otherName || all.defOtherName);
  };

  const getModuleInfo = (moduleId: any) => {
    getModuleDetail(moduleId).then((res) => {
      if (res.resultCode === '000') {
        setModuleData(JSON.parse(res.datas.analysisData));
        setModuleName(res.datas.analysisName);
      } else {
        message.error(res?.resultMsg || '获取模板详情失败');
      }
    });
  };
  const init = async () => {
    await queryEvent('sub_activity');
    if (moduleId) {
      await getModuleInfo(moduleId);
    }
  };
  useEffect(() => {
    getSqlBaseInfo({ theme: 'sub_activity' });
    queryDict();
    init();
  }, []);

  useEffect(() => {
    let flag = Object.keys(baseInfo).length > 0 && Object.keys(moduleData).length > 0;
    let fake: any = null;
    if (flag && type === 'read') {
      fake = setTimeout(() => {
        refreshList();
      }, 300);
    }
    return () => {
      clearTimeout(fake);
    };
  }, [baseInfo, moduleData]);

  const handleExport = useCallback(() => {
    (tableRef.current as any)?.exportExcel();
  }, []);

  const editModalRef = useRef(null);
  //打开编辑弹窗
  const showSaveConfig = async () => {
    const [statisticsSearch, globalSearch, compareSearch] = await Promise.all([
      (StatisticSearchRef.current as any).getForm(),
      (GlobalSearchRef?.current as any).getForm(),
      (CompareSearchRef.current as any).getForm(),
    ]);
    (editModalRef.current as any).open({
      treeSelectId,
      moduleName,
    });
  };

  //保存看板
  const saveModuleData = async ({ moduleName, treeSelectId }: any) => {
    const [statisticsSearch, globalSearch, compareSearch] = await Promise.all([
      (StatisticSearchRef.current as any).getForm(),
      (GlobalSearchRef?.current as any).getForm(),
      (CompareSearchRef.current as any).getForm(),
    ]);
    if (statisticsSearch) {
      statisticsSearch?.childrenList?.forEach((item: any) => {
        item.edit = false;
      });
    }
    const analysisData = JSON.stringify({
      statisticsSearch,
      globalSearch,
      compareSearch,
      moduleType,
    });
    console.log(analysisData);

    const param: any = {
      analysisData,
      analysisBoard: treeSelectId, //选的看板
      analysisName: moduleName, //自定义的看板名称
      analysisType: 'event',
    };

    if (!moduleId || (moduleId && treeSelectId !== dashboardId)) {
      saveAnalysisModule(param).then((res: any) => {
        if (res.resultCode === '000') {
          setModuleName(moduleName);
          message.success('保存成功');
          (editModalRef.current as any).close();
          const info = res.datas || {};
          setModuleId(info.analysisId || '');
          setModuleId(info.analysisBoard || '');
        } else {
          message.error(res?.resultMsg);
        }
        (editModalRef.current as any).close();
      });
    } else {
      //更新
      param.analysisId = moduleId;
      updateModuleData(param).then((res: any) => {
        setModuleName(moduleName);
        if (res.resultCode === '000') {
          message.success('保存成功');
          (editModalRef.current as any).close();
        } else {
          message.error('保存成功');
        }
      });
    }
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
          <Condition r-show={show}>
            <div className={style['select-box']} style={{ marginTop: '10px' }}>
              <Button
                icon={<ReloadOutlined />}
                type="primary"
                onClick={refreshList}
                loading={loading}
              >
                刷新数据
              </Button>
              <Button onClick={showSaveConfig} style={{ marginLeft: '10px' }}>
                保存
              </Button>

              {/* <Button onClick={backData} style={{ marginLeft: '10px' }}>
              回显
            </Button> */}
            </div>
          </Condition>
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
              <Table
                id={1}
                column={dynamicColumns}
                data={activityData}
                cref={tableRef}
                summary={summary}
                operationType={type}
              />
            </div>
          </Card>
        </Spin>
      </div>

      <EditModal cref={editModalRef} onSave={saveModuleData}></EditModal>
    </ConfigProvider>
  );
};

export default AdvertisingAnalyzePage;
