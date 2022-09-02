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
  Tag,
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
import ColumnModal from './components/column-modal';
// 共有数据源
import { modelTypeList } from './model/const';
import { useSearchParamsModel, useFilterModel, useAdvertiseModel, useBaseModel } from './model';

import { supersetRequestData } from './model/process';
import { getModuleDetail } from './model';
import { updateModuleData } from './model/api';
import { saveAnalysisModule } from '../retained-analyze/model/api';
import moment from 'moment';
import ChineseNameMap from './const';

const { Panel } = Collapse;
const { Option } = Select;

interface TemplateAnalyzePageProps {
  type: 'create' | 'read';
  defaultGroupBy?: any[]; // 对比查看默认分组
  extraGroupByList?: any[];
  moduleType: string; //
  id?: string; // 信息id
  dirId?: string; // 看板id
  defaultSortColumn?: string;
  timeColumn?: string;
  unitColumn?: string;
  showTime?: boolean;
  compareTimeFlag?: boolean;
}

const TemplateAnalyzePage: React.FC<any> = (props: TemplateAnalyzePageProps) => {
  const {
    type = 'create',
    id,
    dirId,
    moduleType,
    defaultGroupBy,
    timeColumn = 'event_occur_time', // 时间字段
    unitColumn = 'dekta_time', //  窗口期字段
    showTime = true,
    extraGroupByList,
    defaultSortColumn,
    compareTimeFlag,
  } = props;

  const chineseName = ChineseNameMap[moduleType] || '敏捷分析';

  const show = !(type == 'read');
  const query: any = history.location.query || {};
  const CollapseKey = ['1', '2', '3', '4'];

  const StatisticSearchRef = useRef<any>(null);
  const GlobalSearchRef = useRef<any>(null);
  const CompareSearchRef = useRef<any>(null);
  const tableRef = useRef(null);

  // 搜索条件---选择分析模型
  const [selectModelType, setSelectModelType] = useState<string>('01');

  const { eventList, fieldMap, getPreConfig } = useSearchParamsModel();
  const { baseInfo, getSqlBaseInfo } = useBaseModel();
  const { filterList, unionList, setFilter, setExtraList } = useFilterModel();

  useEffect(() => {
    if (extraGroupByList) {
      setExtraList(extraGroupByList);
    } else {
      setExtraList([]);
    }
  }, [extraGroupByList]);

  const {
    loading, // loading
    setLoading,
    diyColumn, // 自定义指标可选项
    processDiyColumn,
    summary, // 总结数据
    getDataList, // 获取数据
    // clearData, // 清除数据
    titleList,
    setProcessDiyColumn, // 已选择的自定义指标
    setTitleList,
    hadProcessedColumn,
    hadProcessedData,
    setDefaultSortColumn,
  } = useAdvertiseModel();

  const [moduleData, setModuleData] = useState<any>({});
  const [moduleId, setModuleId] = useState<any>(id || query.moduleId || '');
  const [moduleName, setModuleName] = useState<any>('');

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

      console.log(statisticsSearch, globalSearch, compareSearch);

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

      // 加工url参数
      const formDataList = supersetRequestData(
        {
          statisticData: statisticsSearch,
          globalData: globalSearch,
          compareData: compareSearch,
        },
        baseInfo,
        {
          granularity_sqla: timeColumn, // 时间字段
          unitColumn: unitColumn,
          showTime,
        },
      );
      // 查询数据
      getDataList(formDataList, eventList, map, baseInfo);
    } catch (e) {
      setLoading(false);
    }

    // //别名
    // setOtherName(all.otherName || all.defOtherName);
  };

  const getModuleInfo = (moduleId: any, type?: any) => {
    getModuleDetail(moduleId, type)
      .then((res) => {
        if (res.resultCode === '000') {
          let moduleData = JSON.parse(res?.datas?.analysisData || '{}');
          StatisticSearchRef.current.setForm(moduleData?.statisticsSearch);
          GlobalSearchRef.current.setForm(moduleData?.globalSearch);
          let _compareSearch = moduleData?.compareSearch || {};
          _compareSearch = {
            ..._compareSearch,
            daterange: _compareSearch?.daterange?.map?.((item: any) => {
              if (typeof item === 'string') {
                try {
                  let str = moment(item);
                  return str;
                } catch (e) {
                  return undefined;
                }
              } else {
                return undefined;
              }
            }),
          };

          CompareSearchRef.current.setForm(_compareSearch);
          let arr = moduleData?.processDiyColumn;
          console.log(arr);

          setProcessDiyColumn(Array.isArray(arr) ? arr : []);
          setModuleData(moduleData);
          setModuleName(res.datas.analysisName);
        } else {
          message.error(res?.resultMsg || '获取模板详情失败');
        }
      })
      .catch(() => {
        message.error('获取模板详情失败');
      });
  };

  const init = async () => {
    await getPreConfig(moduleType); // 获取两边数据
    if (moduleId) {
      await getModuleInfo(moduleId, moduleType);
    }
  };

  useEffect(() => {
    if (defaultSortColumn) {
      setDefaultSortColumn(defaultSortColumn); // 设置数据加工默认排序字段
    }
    getSqlBaseInfo({ theme: moduleType }); // 获取配置
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

  // 编辑弹窗的ref
  const editModalRef = useRef(null);
  //打开编辑弹窗
  const showSaveConfig = async () => {
    if (hadProcessedData?.length === 0) {
      message.warning('请先进行数据查询,再进行保存');
      return null;
    }
    const [statisticsSearch, globalSearch, compareSearch] = await Promise.all([
      (StatisticSearchRef.current as any).getForm(),
      (GlobalSearchRef?.current as any).getForm(),
      (CompareSearchRef.current as any).getForm(),
    ]);
    if (statisticsSearch.childrenList.length === 0) {
      message.warning('请至少添加一个选择统计事件');
      return null;
    }
    if (globalSearch.childrenList.length === 0) {
      message.warning('请至少添加一个全局筛选事件');
      return null;
    }
    (editModalRef.current as any).open(moduleName, treeSelectId);
  };

  //保存看板
  const saveModuleData = async (analysisName: any, analysisBoard: any) => {
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
    //处理日期
    let _compareSearch = {
      ...compareSearch,
      daterange:
        compareSearch?.daterange?.map?.((item: any) => {
          return item?.format?.() || undefined;
        }) || [],
    };
    const analysisData = JSON.stringify({
      statisticsSearch, // 三大 - 选择统计事件
      globalSearch, // 三大 - 全局查询参数
      compareSearch: _compareSearch, // 三大 - 对比查询参数
      moduleType, // 查表类型
      processDiyColumn, // 加工列
      titleList, // 提供给表格列名
    });

    // console.log('查询参数:----------');
    // console.log(analysisData);

    const param: any = {
      analysisData,
      analysisBoard: analysisBoard, //选的看板
      analysisName: analysisName, //自定义的看板名称
      analysisType: moduleType,
    };

    if (!moduleId || (moduleId && treeSelectId !== dashboardId)) {
      saveAnalysisModule(param).then((res: any) => {
        if (res.resultCode === '000') {
          message.success('保存成功');
          const info = res.datas || {};
          setModuleId(info.analysisId || '');
          setModuleName(analysisName);
          setTreeSelectId(analysisBoard || '');
          setDashboardId(analysisBoard || '');
        } else {
          message.error(res?.resultMsg);
        }
        (editModalRef.current as any).close();
      });
    } else {
      //更新
      param.analysisId = moduleId;
      updateModuleData(param).then((res: any) => {
        if (res.resultCode === '000') {
          message.success('保存成功');
          setModuleName(analysisName);
          setTreeSelectId(analysisBoard || '');
          setDashboardId(analysisBoard || '');
        } else {
          message.error(res?.resultMsg || '未知错误');
        }
        (editModalRef.current as any).close();
      });
    }
  };

  // ---------------
  // 添加自定义弹窗 columnModalRef
  const columnModalRef = useRef(null);
  const openModal = () => {
    if (hadProcessedData?.length < 1) {
      message.warning('当前查询暂无数据');
      return null;
    }
    if (diyColumn?.length < 1) {
      message.warning('请先筛选查询数据再添加自定义指标');
      return null;
    }
    (columnModalRef.current as any).open(processDiyColumn);
  };

  const confirmDIYColumn = (val: any) => {
    console.log(val);
    setProcessDiyColumn(val?.list || []);
  };

  // 设置标题
  const setTitle = (list: any[]) => {
    if (Array.isArray(list)) {
      setTitleList(list);
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['anaylze-page']}>
        {/* 查询条件 */}
        <div className={style['search-box']}>
          <Condition r-show={show}>
            <Collapse defaultActiveKey={CollapseKey} ghost>
              {/* 选择统计事件 */}
              <Panel header="选择统计事件" key="2" extra={addStatisticBt}>
                <StatisticsSearch
                  cref={StatisticSearchRef}
                  fieldMap={fieldMap}
                  eventList={eventList}
                  setFilter={setFilter}
                  showTime={showTime}
                />
              </Panel>

              {/* 全局筛选 */}
              <Panel header="全局筛选" key="3" extra={addGlobalBt}>
                <GlobalSearch
                  cref={GlobalSearchRef}
                  list={filterList}
                  fieldMap={fieldMap}
                  showTime={showTime}
                />
              </Panel>

              <Panel header="对比查看" key="4">
                <CompareSearch
                  cref={CompareSearchRef}
                  list={unionList}
                  setFilter={setTitle}
                  compareTimeFlag={compareTimeFlag}
                  defaultGroupBy
                />
              </Panel>
            </Collapse>
          </Condition>
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

                {/* 非只读模式 */}
                <div>
                  {/* 加工列 */}
                  {processDiyColumn.map((item: any, index: number) => {
                    return (
                      <Tag
                        color="gold"
                        closable
                        key={index}
                        onClose={() => {
                          processDiyColumn.splice(index, 1);
                          setProcessDiyColumn([...processDiyColumn]);
                        }}
                      >
                        {item.alias}
                      </Tag>
                    );
                  })}
                  <Condition r-if={show}>
                    <Button type="link" icon={<PlusCircleOutlined />} onClick={openModal}>
                      添加自定义计算列
                    </Button>
                  </Condition>
                </div>
              </div>
            }
            style={{ marginTop: '10px' }}
          >
            <div className={style['table-box']} style={{ marginTop: '10px' }}>
              <Table
                id={'template-table'}
                chineseName={chineseName}
                column={hadProcessedColumn}
                data={hadProcessedData}
                cref={tableRef}
                summary={summary}
                operationType={type}
              />
            </div>
          </Card>
        </Spin>
      </div>

      <ColumnModal cref={columnModalRef} list={diyColumn} confirm={confirmDIYColumn}></ColumnModal>

      <EditModal cref={editModalRef} onSave={saveModuleData}></EditModal>
    </ConfigProvider>
  );
};

export default TemplateAnalyzePage;
