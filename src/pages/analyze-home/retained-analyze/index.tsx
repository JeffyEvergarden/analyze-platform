import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import { DownloadOutlined, RetweetOutlined } from '@ant-design/icons';
import style from './style.less';
import zhCN from 'antd/lib/locale/zh_CN';
import { saveAnalysisModule, getModuleData, editAnalysisModule } from './model/api';
// 业务组件
// import StatisticsSearch from '../components/statistics-search';
import StatisticsSearch from '../components/statistics-search/testIndex';
import FollowUpSearch from './components/followup-search';
import CompareSearch from './components/compare-search';
import LineChart from './components/line-chart';
import Table from './components/result-table';
// 共有数据源
import { useSearchModel, useBehaviorModel, useListModel, useFilterModel } from './model';
import { groupByList } from './model/const';
// 定制
// import { useTableModel } from './model';
import moment from 'moment';
import 'moment/locale/zh-cn';
import XLSX from 'xlsx';

import EditModal from '../SaveModel/modal';

// Test-minimap
// import MiniMap from './components/MiniMap';
// import { obj } from './test';

const { Panel } = Collapse;
const { Option } = Select;

interface AnalyzePageProps {
  expand?: boolean; // 是否默认展开 折叠
  modelType?: string; // 分析模型类型 01、02、03
}

// 留存分析 -------------

const RetainedAnalyzePage: React.FC<any> = (props: AnalyzePageProps) => {
  const { expand = true, modelType } = props;
  const location: any = useLocation();
  // 是否默认展开 key
  const CollapseKey = expand ? ['1', '2', '3', '4'] : [];

  // 搜索条件---筛选框的数据源
  const { eventList, getPreConfig } = useSearchModel();
  //后续行为
  const { behaviorList, setBehaviorList, getBehaviorConfig } = useBehaviorModel();
  // 表格数据
  const { loading, chartList, tableList, summary, tableDataList, getTable, fake, timeOut } =
    useListModel();

  //检测初始变没
  const [indexField, setIndexField] = useState<any>('');

  const { unionList, setFilter, setExtraList } = useFilterModel();

  const [fieldList, setFieldList] = useState<any[]>([]);
  const [fieldList2, setFieldList2] = useState<any[]>([]);

  useEffect(() => {
    setFilter(fieldList, fieldList2);
  }, [fieldList, fieldList2]);

  useEffect(() => {
    fake.current.unionList = unionList || [];
  }, [unionList]);

  //TEST-miniMap
  // const [saveData, setSaveData] = useState<any>({});

  //别名
  const [otherName, setOtherName] = useState<any>('');

  const firstSearchRef = useRef(null);

  const lastSearchRef = useRef(null);

  const normalSearchRef = useRef(null);

  const tableRef = useRef<any>();
  // 表格、折线数据
  // const { column, tableData, lineData, getTableDataList } = useTableModel();

  //表格选择显示图表
  const [selectedRowDatas, setSelectedRowDatas] = useState<any>([]);

  //分析类型
  const [moduleName, setModuleName] = useState<any>('');
  const [moduleId, setModuleId] = useState<any>('');
  const [boardId, setBoardId] = useState<any>('');
  const [moduleType, setModuleType] = useState<any>('retain');

  const editModalRef = useRef(null);

  // 查询
  const refreshList = async (formEventList: any) => {
    clearTimeout(timeOut.current);
    let statisticsSearch = await (firstSearchRef.current as any).getForm(); //初始行为数据处理为接口需要参数
    let followUpSearch = await (normalSearchRef?.current as any).getForm(); //后续行为数据处理为接口需要参数
    let compareSearch = await (lastSearchRef.current as any).getForm(); //对比查看数据处理为接口需要参数
    // console.log(statisticsSearch);
    // console.log(followUpSearch);
    // console.log(compareSearch);
    let all = Object.assign({}, statisticsSearch, followUpSearch, compareSearch); //合并
    if (statisticsSearch && followUpSearch && compareSearch) {
      // console.log(eventList);
      setTimeout(() => {
        if (eventList.length) {
          getTable(all, eventList);
        } else {
          getTable(all, formEventList);
        }
      }, 200);
    }
    //别名
    setOtherName(all.otherName || all.defOtherName);
  };
  //  保存
  const save = async () => {
    // let all = await Promise.all([
    //   (firstSearchRef.current as any).getForm(),
    //   (normalSearchRef?.current as any).getForm(),
    //   (lastSearchRef.current as any).getForm(),
    // ]);

    let allData = await Promise.all([
      (firstSearchRef.current as any).getFormData(),
      (normalSearchRef?.current as any).getFormData(),
      (lastSearchRef.current as any).getFormData(),
    ]);
    if (!tableList?.length) {
      message.warning('请先查询');
      return;
    }
    // console.log(JSON.stringify(allData));
    if (!allData.every((item) => item)) {
      return;
    }

    console.log(allData);

    //  分析类型
    (editModalRef.current as any).open(moduleName, boardId);
  };

  //提交请求
  const saveSubmit = async (analysisName: any, analysisBoard: any) => {
    //请求所需数据
    let all: any = await Promise.all([
      (firstSearchRef.current as any).getForm(),
      (normalSearchRef?.current as any).getForm(),
      (lastSearchRef.current as any).getForm(),
    ]);

    let statisticsSearch = await (firstSearchRef.current as any).getFormData();
    let followUpSearch = await (normalSearchRef?.current as any).getFormData();
    let compareSearch = await (lastSearchRef.current as any).getFormData();
    if (compareSearch?.dateRange?.length) {
      compareSearch.dateRange[0] = compareSearch?.dateRange[0]?.format?.('YYYY-MM-DD');
      compareSearch.dateRange[1] = compareSearch?.dateRange[1]?.format?.('YYYY-MM-DD');
    }

    all = Object.assign({}, ...all);
    // 过滤没用的东西
    all._eventList = eventList.filter((item: any) => {
      return item.value === all.initEvent;
    });
    // allData = Object.assign({}, ...allData);
    let allData = Object.assign({}, statisticsSearch, followUpSearch, compareSearch); //合并
    let save = { reqData: all, formData: allData, tableColumn: tableList };
    console.log(save);

    if (boardId != analysisBoard) {
      let reqData = {
        analysisBoard,
        analysisData: JSON.stringify(save),
        analysisName,
        analysisType: moduleType,
      };
      saveAnalysisModule(reqData).then((res) => {
        if (res.resultCode === '000') {
          message.success('成功');
          setTimeout(() => {
            window.close();
          }, 1500);
        } else if (Number(res.resultCode) === 403) {
          message.error('没有权限操作');
        } else {
          message.error(res.resultMsg);
        }
        (editModalRef.current as any).close();
      });
    } else {
      let reqData = {
        analysisBoard,
        analysisData: JSON.stringify(save),
        analysisName,
        analysisType: moduleType,
        analysisId: moduleId,
      };
      editAnalysisModule(reqData).then((res) => {
        if (res.resultCode === '000') {
          message.success('成功');
          setTimeout(() => {
            window.close();
          }, 1500);
        } else if (Number(res.resultCode) === 403) {
          message.error('没有权限操作');
        } else {
          message.error(res.resultMsg);
        }
        (editModalRef.current as any).close();
      });
    }
  };

  // 回显
  const backData = async (obj: any) => {
    (firstSearchRef.current as any).setForm(obj?.formData?.first);
    (normalSearchRef?.current as any).setForm(obj?.formData?.last);
    (lastSearchRef.current as any).setForm(obj?.formData?.compare);
    refreshList(eventList || []);
  };

  // mounted初始化
  useEffect(() => {
    getPreConfig('RETAIN_STRATEGY');
    setExtraList(groupByList);
    return () => {
      clearTimeout(timeOut.current);
    };
  }, []);

  useEffect(() => {
    if (eventList?.length > 0 && location.search) {
      let obj = location?.query;
      let _moduleId = obj?.moduleId;
      setBoardId(obj?.dashboardId);
      setModuleId(_moduleId);
      getModuleData(_moduleId).then((res: any) => {
        // console.log(res);
        let data = JSON.parse(res?.datas?.analysisData);
        console.log(data);
        backData(data);
        setModuleName(res?.datas?.analysisName);
        setModuleType(res?.datas?.analysisType);
      });
    }
  }, [eventList]);

  const handleExport = useCallback(() => {
    tableRef.current?.exportExcel();
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['anaylze-page']}>
        {/* 查询条件 */}
        <div className={style['search-box']}>
          <Collapse defaultActiveKey={CollapseKey} ghost>
            {/* 初始行为 */}
            <Panel header="初始行为" key="2">
              <StatisticsSearch
                cref={firstSearchRef}
                list={eventList}
                getBehavior={getBehaviorConfig}
                change={setIndexField}
                setFilter={(list: any[]) => {
                  setFieldList(list);
                }}
              />
            </Panel>

            {/* 后续行为 */}
            <Panel header="后续行为" key="3">
              <FollowUpSearch
                cref={normalSearchRef}
                list={eventList}
                setBehaviorList={setBehaviorList}
                change={indexField}
                setFilter={(list: any[]) => {
                  setFieldList2(list);
                }}
              />
            </Panel>

            <Panel header="对比查看" key="4">
              <CompareSearch cref={lastSearchRef} groupByList={unionList} />
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

            {/* <Button
              onClick={() => {
                backData(obj);
              }}
              style={{ marginLeft: '10px' }}
            >
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
                  {/* <Tooltip placement="top" title={'刷新并重置勾选'}>
                    <RetweetOutlined onClick={refreshList} style={{ marginLeft: '16px' }} />
                  </Tooltip> */}
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
                summary={summary}
                cref={tableRef}
              />
            </div>
          </Card>

          {/* <MiniMap dataJson={obj}></MiniMap> */}
        </Spin>
      </div>
      <EditModal cref={editModalRef} onSave={saveSubmit}></EditModal>
    </ConfigProvider>
  );
};

export default RetainedAnalyzePage;
