import React, { useEffect, useImperativeHandle, useState } from 'react';
// 通用组件
import { Form, Select, Button, Space, Input } from 'antd';

import { PlusSquareOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// 定制组件
import Condition from '../../../components/common/Condition';
import InnerFormItem from '../../../components/common/InnerFormItem';
import SingleFormItem from '../../../components/common/SingleFormItem';
import { statisticNumbericList, statisticDefaultList } from '../../../components/model/const';
import style from './style.less';
import { propcessInitForm } from '../../../model/util';

interface StatisticComponentProps {
  cref: any;
  list: [];
  map?: Map<string, any> | undefined;
  change: any;
  setBehaviorList: any;
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
  const { list, cref, map, change, setBehaviorList } = props;
  const [selectUserType, setSelectUserType] = useState<string>('01');

  // 修改事件 （传入序号） 一级属性
  const changeEvent = (index: number, val: any, opt: any) => {
    console.log(change);

    if (index < 0 || typeof index !== 'number') {
      return;
    }
    const curList = form.getFieldValue('childrenList');
    const currentFormValue: any = curList?.[index] || {};
    console.log(val);
    console.log(opt);
    console.log(curList);
    // 清除子对象其他值
    currentFormValue?.innerList?.forEach((item: any) => {
      item.attr = undefined;
      item.op = undefined;
      item.value = undefined;
    });
    // currentFormValue.innerList[0].op = undefined;
    // currentFormValue.innerList[0].value = undefined;
    // currentFormValue.innerList[0].alias = undefined;

    // 清除当前对象其他值
    currentFormValue.attribute = undefined; // 第二属性 指标
    currentFormValue.operator = undefined; // 第三属性 统计方式  // 求和、去重之类的
    currentFormValue.relation = 'AND';

    // console.log(opt);
    // 指标列表
    currentFormValue.metricsList = opt.opt.metricsList || [];
    // 属性列表
    currentFormValue.fieldList = opt.opt.fieldList || [];
    //一级筛选
    currentFormValue.EventList = list;
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
      operatorList: [],
      subList: [],
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
          console.log(formData);
          // formData.forEach((item: any) => {});
          let init_event_num = formData.EventList?.find((item: any) => {
            return item.value == formData?.event;
          });
          let init_Metric = init_event_num?.metricsList?.find((item: any) => {
            return item.value == formData?.attribute;
          });

          return {
            nextEvent: formData?.event,
            nextMetric: formData?.attribute,
            nextCondition: {
              field: formData?.innerList[0]?.attr || undefined,
              function: formData?.innerList[0]?.op || undefined,
              params: Array.isArray(formData?.innerList[0]?.value)
                ? formData?.innerList[0]?.value.join()
                : formData?.innerList[0]?.value.format
                ? formData?.innerList[0]?.value.format('YYYY-MM-DD')
                : formData?.innerList[0]?.value,
              dataType: formData?.innerList[0]?.dataType,
            },
            otherName: formData?.alias,
            defOtherName: `${init_event_num.name}的${init_Metric.name}`,
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
          let init_event_num = formData.EventList?.find((item: any) => {
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
        obj.innerList[0].alias = obj?.alias;
        form.setFieldsValue({ childrenList: [obj] });
        setBehaviorList(obj?.EventList);
      },
    };
  });

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
    addInnerForm(0);
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
                const metricsList = curItem?.metricsList || [];
                const fieldList = curItem?.fieldList || [];

                const type: string = curItem?.type || ''; // 判断是 指标 还是 属性
                const dataType: string = curItem?.dataType || ''; // 判断数据类型
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
                                  <SingleFormItem
                                    key={innerField.key} // 数组key值
                                    field={innerField} // 包含name、 fieldKey
                                    form={form}
                                    formName={'childrenList'}
                                    list={fieldList}
                                    map={map}
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
