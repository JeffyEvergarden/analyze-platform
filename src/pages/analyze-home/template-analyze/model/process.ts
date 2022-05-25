import moment from 'moment';
import { processANDList } from './common';

//格式化两位小数
export function toFixed2(x: any) {
  let f_x = parseFloat(x);
  if (isNaN(f_x)) {
    return 0;
  }
  f_x = Math.round(x * 100) / 100;
  let s_x = f_x.toString();
  let pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}

// 时间单位 --> 秒数
const changeWindowsCount = (count: any, unit: any) => {
  if (unit === 'day') {
    return Number(count) * 24 * 60 * 60;
  } else if (unit === 'hour') {
    return Number(count) * 60 * 60;
  } else if (unit === 'minute') {
    return Number(count) * 60;
  } else {
    return count;
  }
};

// --------------------
// 加工参数
const processRequestForm = ({ statisticData, globalData, compareData, rawData, extra }: any) => {
  const formDataList: any[] = [];
  statisticData?.childrenList?.forEach((item: any) => {
    const obj = JSON.parse(JSON.stringify(rawData));
    if (!item.fnName) {
      obj.metrics.push(item.attribute);
    } else {
      const complexMetrics: any = {
        expressionType: 'SIMPLE',
        column: {
          id: 242,
          column_name: item.attribute,
          verbose_name: null,
          description: null,
          expression: null,
          filterable: true,
          is_dttm: false,
          type: 'LONG',
          optionName: `_col_${item.attribute}`,
        },
        aggregate: item.fnName,
        sqlExpression: null,
        hasCustomLabel: false,
        fromFromData: true,
        label: null,
        optionName: null,
      };
      switch (item.fnName) {
        case 'SUM':
          complexMetrics.label = item.attribute;
          break;
        case 'MAX':
          complexMetrics.label = item.attribute;
          break;
        case 'MIN':
          complexMetrics.label = item.attribute;
          break;
        case 'COUNT_DISTINCT': //去重
          complexMetrics.label = item.attribute;
          break;
        case 'DISTINCT_AVG': //人均
          complexMetrics.label = item.attribute;
          break;
        case 'AVG': //次均
          complexMetrics.label = item.attribute;
          break;
        default:
          break;
      }
      obj.metrics.push(complexMetrics);
    }
    obj.adhoc_filters.push({
      expressionType: 'SIMPLE',
      subject: 'event_type',
      operator: '==',
      comparator: item.event,
      clause: 'WHERE',
      fromFormData: true,
      isExtra: false,
      sqlExpression: null,
      filterOptionName: '',
    });
    if (item.relation === 'AND') {
      //介于
      processANDList(item.innerList, obj.adhoc_filters, extra.showTime);
    } else if (item.relation === 'OR') {
      const tempFilters: any = [];
      item.innerList.map((innerItem: any) => {
        if (innerItem.operator !== 'in' && innerItem.operator !== 'not in') {
          if (innerItem?.operator == 'between') {
            if (innerItem?.params instanceof Array) {
              let list: any[] = innerItem.params.map((item: any, i: number) => {
                let _params = item;
                if (_params instanceof moment) {
                  if (i === 1) {
                    _params = `cast('${(_params as any)?.endOf('day')?.format?.()}' as TIMESTAMP)`;
                  } else {
                    _params = `cast('${(_params as any)
                      ?.startOf('day')
                      ?.format?.()}' as TIMESTAMP)`;
                  }
                }
                if (typeof _params !== 'number') {
                  _params = `'${_params}'`;
                }
                return _params;
              });
              tempFilters.push(
                `${innerItem.subject} >= ${list?.[0]} AND ${innerItem.subject} <= ${list?.[1]}`,
              );
            }
          } else {
            let _params = innerItem.params;
            if (_params instanceof moment) {
              _params = `cast('${(_params as any).format?.()}' as TIMESTAMP)`;
            }
            if (typeof _params !== 'number') {
              _params = `'${_params}'`;
            }

            tempFilters.push(
              `${innerItem.subject} ${
                innerItem.operator == '==' ? '=' : innerItem.operator
              } ${_params}`,
            );
          }
        } else {
          const tempParams: any = [];
          if (innerItem.params instanceof Array) {
            innerItem.params?.map((item: any) => {
              if (typeof item !== 'number') {
                item = `'${item}'`;
              }
              tempParams.push(`${item}`);
            });
          } else {
            tempParams.push(`'${innerItem.params}'`);
          }
          tempFilters.push(
            `${innerItem.subject} ${
              innerItem.operator == '==' ? '=' : innerItem.operator
            } (${tempParams.join(',')})`,
          );
        }
      });
      if (item.innerList?.length) {
        obj.adhoc_filters.push({
          expressionType: 'SQL',
          subject: null,
          operator: null,
          comparator: null,
          clause: 'WHERE',
          fromFormData: true,
          isExtra: false,
          sqlExpression: tempFilters.join(' OR '),
          filterOptionName: '',
        });
      }
    }
    //  全局指标
    processANDList(globalData?.childrenList, obj.adhoc_filters, extra.showTime);
    //分组
    obj.groupby = [...compareData.groupBy];
    // //时间维度
    // obj.time_grain_sqla = 'P1D';
    // 事件发生日期字段
    //时间范围
    if (compareData.daterange?.length === 2) {
      const time1 = compareData.daterange[0].format('YYYY-MM-DD');
      const time2 = compareData.daterange[1].format('YYYY-MM-DD');
      const timeRange = `${time1}T00:00:00+08:00 : ${time2}T23:59:59+08:00`;
      obj.time_range = timeRange;
    }
    if (compareData.windowCount && compareData.windowUnit) {
      obj.adhoc_filters.push({
        expressionType: 'SIMPLE',
        subject: extra?.unitColumn || 'dekta_time', // todo // 窗口期字段
        operator: '<=',
        comparator: changeWindowsCount(compareData.windowCount, compareData.windowUnit),
        clause: 'WHERE',
        fromFormData: true,
        isExtra: false,
        sqlExpression: null,
        filterOptionName: '',
      });
    }
    formDataList.push(obj);
  });
  return formDataList;
};
// 加工superset参数
export const supersetRequestData = (
  { statisticData, globalData, compareData }: any,
  baseInfo: any,
  extra?: any,
) => {
  const rawData: any = {
    datasource: baseInfo.dataSource,
    slice_id: baseInfo.sliceId,
    viz_type: 'table',
    url_params: {},
    time_range_endpoints: ['inclusive', 'inclusive'],
    granularity_sqla: extra?.granularity_sqla || 'event_occur_time', // 时间纬度 todo
    time_grain_sqla: '', //事件维度
    time_range: '',
    metrics: ['order_count'],
    adhoc_filters: [],
    groupby: [],
    timeseries_limit_metric: null,
    order_desc: true,
    contribution: false,
    row_limit: 1000,
    color_scheme: 'bnbColors',
    label_colors: {},
    show_brush: 'auto',
    send_time_range: false,
    show_legend: true,
  };
  const formDataList = processRequestForm({
    statisticData,
    globalData,
    compareData,
    rawData,
    extra,
  });
  return formDataList;
};
