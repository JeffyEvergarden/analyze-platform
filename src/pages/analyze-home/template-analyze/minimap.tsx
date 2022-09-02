import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useModel, useLocation, history } from 'umi';
import { Card, Divider, Spin, ConfigProvider, message, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import style from './style.less';
// 业务组件
import Table from './components/result-table';

import { useSearchParamsModel, useAdvertiseModel, useBaseModel } from './model';

import { supersetRequestData } from './model/process';
import { getModuleDetail } from './model';
import ChineseNameMap from './const';
import moment from 'moment';

const defaultSortMap: any = {
  sub_activity_2: 'advertchannel',
};

const extraMap: any = {
  default: {
    timeColumn: 'event_occur_time', // 时间字段
    unitColumn: 'dekta_time', //  窗口期字段
  },
  price_change: {
    timeColumn: 'event_time', // 时间字段
    unitColumn: 'interval_second', //  窗口期字段
  },
  adj_limit: {
    timeColumn: 'event_time', // 时间字段
    unitColumn: 'interval_second', //  窗口期字段
  },
  operation_index: {
    timeColumn: '', // 时间字段
    unitColumn: undefined, //  窗口期字段
  },
};

const MiniMap: React.FC<any> = (props: any) => {
  const { id = '123', dirId, moduleType = 'sub_activity_2' } = props;

  const chineseName: any = (ChineseNameMap as any)[moduleType] || '敏捷分析';

  const query: any = history.location.query || {};

  const extra = extraMap[moduleType] || extraMap['default'];

  const tableRef = useRef(null);

  const { eventList, getPreConfig } = useSearchParamsModel();
  const { baseInfo, getSqlBaseInfo } = useBaseModel();

  const {
    loading, // loading
    setLoading,
    processDiyColumn,
    summary, // 总结数据
    getDataList, // 获取数据
    setProcessDiyColumn, // 已选择的自定义指标
    hadProcessedColumn,
    hadProcessedData,
    setTitleList,
    setDefaultSortColumn,
  } = useAdvertiseModel();

  const [moduleData, setModuleData] = useState<any>({});
  const [moduleId, setModuleId] = useState<any>(id || query.moduleId || '');

  const [msg, setMsg] = useState<any>('');

  // 刷新数据
  const refreshList = async () => {
    setMsg('');
    try {
      const { statisticsSearch, globalSearch, compareSearch } = moduleData;

      let flag = Object.keys(baseInfo).length > 0;
      if (!flag) {
        message.warning('获取不到数据库信息');
        return null;
      }

      //汇总
      const map: any = {}; // 别名map 对象 key=>alisa
      if (!statisticsSearch || !globalSearch || !statisticsSearch.childrenList) {
        setMsg('查询配置信息异常');
        return null;
      } else {
        //生成别名映射
        statisticsSearch.childrenList.forEach((item: any, index: any) => {
          // 生成别名映射
          if (item.alias) {
            item.index = index;
            const name = `${item.event || ''}_${item.attribute || ''}_${item.fnName || ''}`;
            let i = 0;
            map[index + '_' + name] = item.alias;
          }
        });
      }
      // 报错
      if (statisticsSearch.childrenList.length === 0 || globalSearch.childrenList.length === 0) {
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
          granularity_sqla: extra.timeColumn, // 时间字段
          unitColumn: extra.unitColumn,
        },
      );
      // 查询数据
      getDataList(formDataList, eventList, map, baseInfo);
    } catch (e) {
      setMsg('查询异常');
      setLoading(false);
    }

    // //别名
    // setOtherName(all.otherName || all.defOtherName);
  };

  // 设置标题
  const setTitle = (list: any[]) => {
    if (Array.isArray(list)) {
      setTitleList(list);
    }
  };

  const getModuleInfo = (moduleId: any, type?: any) => {
    getModuleDetail(moduleId, type)
      .then((res) => {
        if (res.resultCode === '000') {
          // 数据格式化处理
          let moduleData = JSON.parse(res?.datas?.analysisData || '{}');
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
          moduleData.compareSearch = _compareSearch;

          let arr = moduleData?.processDiyColumn;
          setProcessDiyColumn(Array.isArray(arr) ? arr : []);
          setTitle(moduleData?.titleList);
          setModuleData(moduleData);
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
      await getModuleInfo(moduleId, moduleType); // 加载数据
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    if (defaultSortMap[moduleType]) {
      setDefaultSortColumn(defaultSortMap[moduleType]);
    }

    getSqlBaseInfo({ theme: moduleType }); // 获取配置
    init();
  }, []);

  useEffect(() => {
    let flag = Object.keys(baseInfo).length > 0 && Object.keys(moduleData).length > 0;
    let fake: any = null;
    if (flag) {
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

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['anaylze-page']}>
        <Spin spinning={loading}>
          {/* 测试功能 */}
          <Card
            title={
              <div className={style['result']}>
                <div>
                  <span>结果</span>
                  <Divider type="vertical"></Divider>
                  <DownloadOutlined onClick={handleExport}></DownloadOutlined>

                  <span style={{ color: 'red', marginLeft: '30px' }}>{msg}</span>
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
                operationType={'read'}
              />
            </div>
          </Card>
        </Spin>
      </div>
    </ConfigProvider>
  );
};

export default MiniMap;
