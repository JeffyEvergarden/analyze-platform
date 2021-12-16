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
import MiniMap from './components/MiniMap';
// 共有数据源
import { useSearchModel, useBehaviorModel, useListModel } from './model';
import { modelTypeList, userTypeList } from './model/const';
import { groupByList } from './model/const';
// 定制
// import { useTableModel } from './model';
import moment from 'moment';
import 'moment/locale/zh-cn';

import EditModal from '../SaveModel/modal';

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
  const { behaviorList, setBehaviorList, getBehaviorConfig } = useBehaviorModel();
  // 表格数据
  const { loading, chartList, tableList, tableDataList, getTable } = useListModel();

  //检测初始变没
  const [test, setTest] = useState<any>('');

  //TEST-miniMap
  const [saveData, setSaveData] = useState<any>({});

  //别名
  const [otherName, setOtherName] = useState<any>('');

  const firstSearchRef = useRef(null);

  const lastSearchRef = useRef(null);

  const normalSearchRef = useRef(null);
  // 表格、折线数据
  // const { column, tableData, lineData, getTableDataList } = useTableModel();

  //表格选择显示图表
  const [selectedRowDatas, setSelectedRowDatas] = useState<any>([]);

  //分析类型
  const [moduleName, setModuleName] = useState<any>('');
  const [moduleId, setModuleId] = useState<any>('');
  const [boardId, setBoardId] = useState<any>('');
  const [moduleType, setModuleType] = useState<any>('retain');

  const getvl = (url: any) => {
    let obj: any = {},
      index = url.indexOf('?'), // 看url有没有参数
      params = url.substr(index + 1); // 截取url参数部分 name = aaa & age = 20

    if (index != -1) {
      // 有参数时
      let parr = params.split('&'); // 将参数分割成数组 ["name = aaa", "age = 20"]
      for (let i of parr) {
        // 遍历数组
        let arr = i.split('='); // 1） i name = aaa   arr = [name, aaa]  2）i age = 20  arr = [age, 20]
        obj[arr[0]] = arr[1]; // obj[arr[0]] = name, obj.name = aaa   obj[arr[0]] = age, obj.age = 20
      }
    }

    return obj;
  };

  const editModalRef = useRef(null);

  // 查询
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
  //  保存
  const save = async () => {
    let all = await Promise.all([
      (firstSearchRef.current as any).getForm(),
      (normalSearchRef?.current as any).getForm(),
      (lastSearchRef.current as any).getForm(),
    ]);
    let allData = await Promise.all([
      (firstSearchRef.current as any).getFormData(),
      (normalSearchRef?.current as any).getFormData(),
      (lastSearchRef.current as any).getFormData(),
    ]);
    console.log(allData);

    //  分析类型
    (editModalRef.current as any).open(moduleName, boardId);
  };

  //提交请求
  const saveSubmit = async (analysisName: any, analysisBoard: any) => {
    //请求所需数据
    let all = await Promise.all([
      (firstSearchRef.current as any).getForm(),
      (normalSearchRef?.current as any).getForm(),
      (lastSearchRef.current as any).getForm(),
    ]);
    //回显所需数据
    // let allData = await Promise.all([
    //   (firstSearchRef.current as any).getFormData(),
    //   (normalSearchRef?.current as any).getFormData(),
    //   (lastSearchRef.current as any).getFormData(),
    // ]);
    let statisticsSearch = await (firstSearchRef.current as any).getFormData();
    let followUpSearch = await (normalSearchRef?.current as any).getFormData();
    let compareSearch = await (lastSearchRef.current as any).getFormData();
    if (compareSearch?.dateRange?.length) {
      compareSearch.dateRange[0] = compareSearch?.dateRange[0]?.format?.('YYYY-MM-DD');
      compareSearch.dateRange[1] = compareSearch?.dateRange[1]?.format?.('YYYY-MM-DD');
    }
    all = Object.assign({}, ...all);
    // allData = Object.assign({}, ...allData);
    let allData = Object.assign({}, statisticsSearch, followUpSearch, compareSearch); //合并
    let save = { reqData: all, formData: allData };
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
    refreshList();
  };

  // mounted初始化
  useEffect(() => {
    console.log(location);
    let afterUrl: any = window.location.search;
    if (afterUrl) {
      let obj = getvl(afterUrl);
      let moduleId1 = obj.moduleId;
      setBoardId(obj.dashboardId);
      setModuleId(moduleId1);
      getModuleData(moduleId1).then((res: any) => {
        let data = JSON.parse(res?.datas?.analysisData);
        backData(data);

        setModuleName(res?.datas?.analysisName);
        setModuleType(res?.datas?.analysisType);
      });
      // console.log(obj);
      // let formData = obj?.formData && JSON.parse(obj?.formData);
      // if (formData) {
      //   backData(formData);
      // }
    }
    getPreConfig('RETAIN_STRATEGY');
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
              <FollowUpSearch
                cref={normalSearchRef}
                list={behaviorList}
                setBehaviorList={setBehaviorList}
                change={test}
              />
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

          {/* <MiniMap dataJson={saveData}></MiniMap> */}
        </Spin>
      </div>
      <EditModal cref={editModalRef} onSave={saveSubmit}></EditModal>
    </ConfigProvider>
  );
};

export default RetainedAnalyzePage;
