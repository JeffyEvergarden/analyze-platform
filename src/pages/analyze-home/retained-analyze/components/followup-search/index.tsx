import React, { useEffect, useImperativeHandle, useState } from 'react';
// 通用组件
import { Form, Select, Button, Space, Input, Tooltip } from 'antd';

import { PlusSquareOutlined, HighlightOutlined, PlusOutlined } from '@ant-design/icons';
// 定制组件
import Condition from '../../../components/common/Condition';
import InnerFormItem from '../../../components/common/InnerFormItem';
import { statisticNumbericList, statisticDefaultList } from '../../../components/model/const';
import style from './style.less';
import { propcessInitForm } from '../../../model/util';

interface StatisticComponentProps {
  cref: any;
  list: [];
  map?: Map<string, any> | undefined;
  change: any;
  setBehaviorList: any;
  setFilter?: (...args: any) => void;
}

interface StatisticItemProps {
  event?: string | undefined; // 事件类型
  attribute?: string | undefined; // 属性/指标
  operator?: string | undefined; // 统计方式
  type?: string | undefined; //  fields/metric 属性/指标
  dataType?: string | undefined; // number/input/select/dateTime
  innerList?: any[];
}

// 通用方法
const trim = (text: any) => {
  if (typeof text === 'string') {
    return text.trim();
  }
  return text;
};

const formateRelation = (text: any) => {
  if (text === 'AND') {
    return '且';
  }
  if (text === 'OR') {
    return '或';
  }
  return '-';
};

const { Item: FormItem } = Form;
const { Option } = Select;

const StatisticComponent: React.FC<any> = (props: StatisticComponentProps) => {
  const [form] = Form.useForm();
  const { list, cref, map, change, setBehaviorList, setFilter } = props;

  // 修改事件 （传入序号） 一级属性
  const changeEvent = (index: number, val: any, opt: any) => {
    if (index < 0 || typeof index !== 'number') {
      return;
    }
    const curList = form.getFieldValue('childrenList');
    const currentFormValue: any = curList?.[index] || {};

    // 清除子对象其他值
    currentFormValue?.innerList?.forEach((item: any) => {
      item.attr = undefined;
      item.op = undefined;
      item.value = undefined;
    });

    // 清除当前对象其他值
    currentFormValue.attribute = undefined; // 第二属性 指标
    currentFormValue.operator = undefined; // 第三属性 统计方式  // 求和、去重之类的
    currentFormValue.relation = 'AND';

    let list = opt.opt.fieldList || [];
    setFilter?.(list || []);

    // console.log(opt);
    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  // 修改指标
  const changeAttribute = (val: any, options: any, outIndex: number) => {
    const curList = form.getFieldValue('childrenList');
    curList[outIndex].operator = undefined;
    curList[outIndex].type = options.opt.type; // 指标/属性
    curList[outIndex].dataType = options.opt.dataType; // input / select / number
    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  // 修改关系
  const changeRelation = (outIndex: number) => {
    const curList: any = form.getFieldValue('childrenList');
    const currentFormValue: any = curList?.[outIndex] || {};
    currentFormValue.relation = currentFormValue.relation === 'AND' ? 'OR' : 'AND';
    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  // 添加子筛选
  const addInnerForm = (outIndex: number) => {
    const curList: any = form.getFieldValue('childrenList');
    // console.log(curList);
    const currentFormValue: any = curList?.[outIndex] || {};
    // console.log(currentFormValue);
    currentFormValue.innerList = currentFormValue.innerList || [];
    currentFormValue.innerList.push({
      attr: undefined,
      op: undefined,
      value: undefined,
      dataType: 'input',
    });
    // console.log(curList);

    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  useImperativeHandle(cref, () => {
    return {
      //获取接口所需数据
      async getForm() {
        const fieldsValue: any = await form.validateFields();
        if (fieldsValue) {
          let formData = form.getFieldValue('childrenList')[0];
          console.log('后续form', formData);
          // formData.forEach((item: any) => {});
          let init_event_num: any = list?.find((item: any) => {
            return item.value == formData?.event;
          });
          let init_Metric = init_event_num?.metricsList?.find((item: any) => {
            return item.value == formData?.attribute;
          });

          return {
            nextEvent: formData?.event, // 事件
            nextMetric: formData?.attribute, // 指标
            nextCondition: formData?.innerList?.map((item: any) => {
              return {
                field: item.attr,
                function: item.op,
                params: Array.isArray(item.value)
                  ? item.value.join()
                  : item.value.format
                  ? item.value.format('YYYY-MM-DD')
                  : item.value,
                dataType: item.dataType,
              };
            }),
            otherName: formData?.alias,
            defOtherName: `${init_event_num?.name || '-'}的${init_Metric?.name || '-'}`,
          };
        } else {
          return false;
        }
      },
      //获取当前表单选择数据
      async getFormData() {
        const fieldsValue: any = await form.validateFields();
        // console.log(fieldsValue);

        if (fieldsValue) {
          const formData = form.getFieldValue('childrenList')[0];
          let init_event_num: any = list?.find((item: any) => {
            return item.value == formData?.event;
          });
          let init_Metric = init_event_num?.metricsList?.find((item: any) => {
            return item.value == formData?.attribute;
          });
          return {
            last: Object.assign({}, formData, {
              defOtherName: `${init_event_num.name}的${init_Metric.name}`,
            }),
          };
        } else {
          return false;
        }
      },
      //数据回显
      async setForm(obj: any) {
        obj = propcessInitForm(obj);
        // obj.innerList[0].alias = obj?.alias;
        form.setFieldsValue({ childrenList: [obj] });
        setBehaviorList(list);
      },
    };
  });

  // 修改别名
  const changeFilterAlias = (field: any, outIndex: any) => {
    const formValueList = form.getFieldValue('childrenList');
    const selectItem = formValueList[outIndex];
    selectItem.edit = !selectItem.edit;
    selectItem.alias = trim(selectItem.alias);
    form.setFieldsValue({
      childrenList: [...formValueList],
    });
  };

  // 删除里层的form
  const delInnerForm = (innerIndex: number, outIndex: number) => {
    const curList: any = form.getFieldValue('childrenList');
    const currentFormValue: any = curList?.[outIndex] || {};
    currentFormValue.innerList = currentFormValue.innerList || [];
    currentFormValue.innerList = currentFormValue.innerList.filter((item: any, index: number) => {
      return index !== innerIndex;
    });
    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  // 初始化
  useEffect(() => {
    // 数据初始化
    form.setFieldsValue({
      childrenList: [
        {
          event: undefined,
          attribute: undefined,
          operator: undefined,
          relation: 'AND',
        },
      ],
    });
    // addInnerForm(0);
  }, [change]);

  const fieldChangeFunc = (changedFields: any, allFields: any) => {
    // console.log('fieldChangeFunc', changedFields);
    if (changedFields[0]?.name?.length === 5) {
      let newVal = [...changedFields[0]?.name];
      const curList: any = form.getFieldValue(newVal[0]);
      const currentFormValue: any = curList?.[newVal[1]] || {};
      currentFormValue.innerList = currentFormValue[newVal[2]] || [];
      currentFormValue.innerList[newVal[3]][newVal[4]] = changedFields[0]?.value;
      form.setFieldsValue({
        childrenList: [...curList],
      });
      // console.log('currentFormValue', currentFormValue.innerList[newVal[3]][newVal[4]]);
      // console.log(newVal?.['value']);
    }
  };

  return (
    <Form form={form} onFieldsChange={fieldChangeFunc}>
      <Form.List name="childrenList">
        {(fields, { add: addOut, remove: removeOut }) => {
          return (
            <>
              {fields?.map((field: any, outIndex: number) => {
                const curItem = form.getFieldValue('childrenList')[outIndex];
                // console.log(curItem);
                const _event = curItem?.event;
                const _curItemObj: any = list.find((item: any) => {
                  return item.value === _event;
                });
                const metricsList: any = _curItemObj?.metricsList || [];
                const fieldList = _curItemObj?.fieldList || [];

                const type: string = _curItemObj?.type || ''; // 判断是 指标 还是 属性
                const dataType: string = _curItemObj?.dataType || ''; // 判断数据类型
                let subList: any[] = []; // 三级下拉列表
                if (type === 'fields' && dataType === 'number') {
                  subList = statisticNumbericList;
                } else if (type === 'fields') {
                  subList = statisticDefaultList;
                }

                //
                const relation = curItem?.relation;

                return (
                  <div key={field.fieldKey}>
                    {/* 前置筛选 */}
                    <Space align="baseline" style={{ height: '32px', marginBottom: '24px' }}>
                      {/* 一级筛选 */}
                      <FormItem
                        rules={[{ required: true, message: '请选择事件' }]}
                        name={[field.fieldKey, 'event']}
                        fieldKey={[field.fieldKey, 'event']}
                        style={{ width: '200px' }}
                      >
                        <Select
                          placeholder="请选择事件"
                          onChange={(val: any, opt: any) => {
                            changeEvent(outIndex, val, opt);
                          }}
                        >
                          {list.map((item: any, index: number) => {
                            return (
                              <Option key={index} value={item.value} opt={item}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>

                      <span>的</span>

                      {/* 二级筛选 */}
                      <FormItem
                        rules={[{ required: true, message: '请选择查询指标/属性' }]}
                        name={[field.fieldKey, 'attribute']}
                        fieldKey={[field.fieldKey, 'attribute']}
                        style={{ width: '180px' }}
                      >
                        <Select
                          placeholder="请选择查询指标/属性"
                          onChange={(val: any, opt: any) => {
                            changeAttribute(val, opt, outIndex);
                          }}
                        >
                          {/* 指标列表 */}
                          {metricsList.map((item: any, index: any) => {
                            return (
                              <Option key={index} value={item.value} opt={item}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>
                      {/* {type} */}
                      {/* 三级筛选 */}
                      <Condition r-if={type === 'fields'}>
                        <FormItem
                          rules={[{ required: true, message: '请选择统计方式' }]}
                          name={[field.fieldKey, 'operator']}
                          fieldKey={[field.fieldKey, 'operator']}
                          style={{ width: '150px' }}
                        >
                          <Select placeholder="请选择统计方式">
                            {/* 指标列表 */}
                            {subList.map((item: any, index: any) => {
                              return (
                                <Option key={index} value={item.value} opt={item}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>
                        </FormItem>
                      </Condition>

                      <PlusSquareOutlined
                        style={{
                          color: '#1890ff',
                          marginLeft: '5px',
                          marginTop: '2px',
                          fontSize: '20px',
                        }}
                        onClick={() => {
                          addInnerForm(outIndex);
                        }}
                      />

                      <Tooltip title="编辑指标别名">
                        <HighlightOutlined
                          style={{
                            color: '#1890ff',
                            marginLeft: '24px',
                            marginTop: '2px',
                            fontSize: '20px',
                          }}
                          onClick={() => {
                            changeFilterAlias(field, outIndex);
                          }}
                        />
                      </Tooltip>
                      <Condition r-if={curItem?.edit}>
                        <FormItem
                          name={[field.fieldKey, 'alias']}
                          key={field.fieldKey + 'alias'}
                          fieldKey={[field.fieldKey, 'alias']}
                        >
                          <Input
                            style={{ width: '150px' }}
                            placeholder="请输入别名"
                            onPressEnter={() => {
                              changeFilterAlias(field, outIndex);
                            }}
                            maxLength={20}
                            autoComplete="off"
                          ></Input>
                        </FormItem>
                      </Condition>

                      <Condition r-if={!curItem?.edit && curItem?.alias}>
                        <div style={{ marginLeft: '15px' }}>
                          别名：
                          <span className={style['static-box_alias']}>{curItem?.alias}</span>
                        </div>
                      </Condition>
                    </Space>

                    <Form.List name={[field.fieldKey, 'innerList']}>
                      {(innerFields, { add, remove }) => {
                        return (
                          <div className={style['extra-box']}>
                            {/* 左布局放关系 */}
                            <div style={{ width: '50px' }}>
                              <Condition r-if={innerFields && innerFields.length > 1}>
                                <div className={style['layout_left']}>
                                  <button
                                    type="button"
                                    className={style['relation-button']}
                                    onClick={() => {
                                      changeRelation(outIndex);
                                    }}
                                  >
                                    {formateRelation(relation)}
                                  </button>
                                </div>
                              </Condition>
                            </div>
                            <div className={style['layout_right']}>
                              {innerFields.map((innerField, innerIndex) => {
                                // console.log('innerFields:', innerField);
                                return (
                                  <InnerFormItem
                                    key={innerField.key} // 数组key值
                                    field={innerField} // 包含name、 fieldKey
                                    outIndex={outIndex}
                                    form={form}
                                    list={fieldList}
                                    map={map}
                                    remove={() => {
                                      // remove(innerIndex);
                                      delInnerForm(innerIndex, outIndex);
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      }}
                    </Form.List>
                  </div>
                );
              })}
            </>
          );
        }}
      </Form.List>
    </Form>
  );
};

export default StatisticComponent;
