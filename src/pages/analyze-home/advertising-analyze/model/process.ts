import moment from 'moment';

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
const processRequestForm = ({ statisticData, globalData, compareData, rawData }: any) => {
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
      item.innerList.map((innerItem: any) => {
        //介于
        if (innerItem?.operator == 'between') {
          if (innerItem?.params instanceof Array) {
            obj.adhoc_filters.push({
              expressionType: 'SIMPLE',
              subject: innerItem.subject,
              operator: '>=',
              comparator: innerItem.params?.[0]?.format
                ? innerItem.params?.[0]?.startOf('day')?.format()
                : innerItem.params[0],
              clause: 'WHERE',
              fromFormData: true,
              isExtra: false,
              sqlExpression: null,
              filterOptionName: '',
            });
            obj.adhoc_filters.push({
              expressionType: 'SIMPLE',
              subject: innerItem.subject,
              operator: '<=',
              comparator: innerItem.params?.[1]?.format
                ? innerItem.params?.[1]?.endOf('day')?.format()
                : innerItem.params[1],
              clause: 'WHERE',
              fromFormData: true,
              isExtra: false,
              sqlExpression: null,
              filterOptionName: '',
            });
          }
        } else {
          obj.adhoc_filters.push({
            expressionType: 'SIMPLE',
            subject: innerItem.subject,
            operator: innerItem.operator,
            comparator: innerItem.params?.format ? innerItem.params.format() : innerItem.params,
            clause: 'WHERE',
            fromFormData: true,
            isExtra: false,
            sqlExpression: null,
            filterOptionName: '',
          });
        }
      });
    } else if (item.relation === 'OR') {
      const tempFilters: any = [];
      item.innerList.map((innerItem: any) => {
        if (innerItem.operator !== 'in' && innerItem.operator !== 'not in') {
          if (innerItem?.operator == 'between') {
            if (innerItem?.params instanceof Array) {
              let list: any[] = innerItem.params.map((item: any) => {
                let _params = item;
                if (_params instanceof moment) {
                  _params = (_params as any).format?.();
                }
                if (typeof _params !== 'number') {
                  _params = `${_params}`;
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
              _params = (_params as any).format?.();
            }
            if (typeof _params !== 'number') {
              _params = `${_params}`;
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
              tempParams.push(`'${item}'`);
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
    //  全局指标
    globalData?.childrenList?.map((gl: any) => {
      if (gl?.operator == 'between') {
        if (gl.params instanceof Array) {
          obj.adhoc_filters.push({
            expressionType: 'SIMPLE',
            subject: gl.subject,
            operator: '>=',
            comparator: gl?.params?.[0]?.format
              ? gl?.params?.[0].startOf('day')?.format()
              : gl?.params?.[0],
            clause: 'WHERE',
            fromFormData: true,
            isExtra: false,
            sqlExpression: null,
            filterOptionName: '',
          });
          obj.adhoc_filters.push({
            expressionType: 'SIMPLE',
            subject: gl.subject,
            operator: '<=',
            comparator: gl?.params?.[1]?.format
              ? gl?.params?.[1].endOf('day')?.format()
              : gl?.params?.[1],
            clause: 'WHERE',
            fromFormData: true,
            isExtra: false,
            sqlExpression: null,
            filterOptionName: '',
          });
        }
      } else {
        obj.adhoc_filters.push({
          expressionType: 'SIMPLE',
          subject: gl.subject,
          operator: gl.operator,
          comparator: gl.params,
          clause: 'WHERE',
          fromFormData: true,
          isExtra: false,
          sqlExpression: null,
          filterOptionName: '',
        });
      }
    });
    //分组
    obj.groupby = compareData.groupBy;
    //时间维度
    obj.time_grain_sqla = compareData.dateUnit;
    //时间范围
    if (compareData.daterange?.length === 2) {
      const time1 = compareData.daterange[0].format('YYYY-MM-DD');
      const time2 = compareData.daterange[1].format('YYYY-MM-DD');
      const timeRange = `${time1}T00:00:00+08:00 : ${time2}23:59:59+08:00`;
      obj.time_range = timeRange;
    }
    if (compareData.windowsCount && compareData.windowsUnit) {
      obj.adhoc_filters.push({
        expressionType: 'SIMPLE',
        subject: 'dekta_time',
        operator: '<=',
        comparator: changeWindowsCount(compareData.windowsCount, compareData.windowsUnit),
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
) => {
  const rawData: any = {
    datasource: baseInfo.dataSource,
    slice_id: baseInfo.sliceId,
    viz_type: 'table',
    url_params: {},
    time_range_endpoints: ['inclusive', 'inclusive'],
    granularity_sqla: compareData.dateType || 'day_id', // 时间纬度
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
  });
  return formDataList;
};
